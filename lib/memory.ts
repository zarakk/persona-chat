import { Redis } from "@upstash/redis";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";

export type PersonaKey = {
  personaName: string;
  modelName: string;
  userId: string;
};

export class MemoryManager {
  private static instance: MemoryManager;
  private history: Redis;
  private vectorDBClient: Pinecone;

  public constructor() {
    this.history = Redis.fromEnv();
    this.vectorDBClient = new Pinecone({
      environment: "gcp-starter",
      apiKey: process.env.PINECONE_API_KEY!,
      // process.env.PINECONE_ENVIRONMENT!,
    });
  }

  public async init() {
    if (this.vectorDBClient instanceof Pinecone) {
      await this.vectorDBClient;
    }
  }

  public async vectorSearch(
    recentChatHistory: string,
    personaFileName: string
  ) {
    const pineconeClient = <Pinecone>this.vectorDBClient;

    const pineconeIndex: any = pineconeClient.Index(
      process.env.PINECONE_INDEX! || ""
    );

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
      { pineconeIndex }
    );

    const similarDocs = await vectorStore
      .similaritySearch(recentChatHistory, 3, { fileName: personaFileName })
      .catch((err) => {
        console.log("WARNING: failed to get vector search results.", err);
      });
    return similarDocs;
  }

  public static async getInstance(): Promise<MemoryManager> {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
      await MemoryManager.instance.init();
    }
    return MemoryManager.instance;
  }

  private generateRedisPersonaKey(personaKey: PersonaKey): string {
    return `${personaKey.personaName}-${personaKey.modelName}-${personaKey.userId}`;
  }

  public async writeToHistory(text: string, personaKey: PersonaKey) {
    if (!personaKey || typeof personaKey.userId == "undefined") {
      console.log("Persona key set incorrectly");
      return "";
    }

    const key = this.generateRedisPersonaKey(personaKey);
    const result = await this.history.zadd(key, {
      score: Date.now(),
      member: text,
    });

    return result;
  }

  public async readLatestHistory(personaKey: PersonaKey): Promise<string> {
    if (!personaKey || typeof personaKey.userId == "undefined") {
      console.log("Persona key set incorrectly");
      return "";
    }

    const key = this.generateRedisPersonaKey(personaKey);
    let result = await this.history.zrange(key, 0, Date.now(), {
      byScore: true,
    });

    result = result.slice(-30).reverse();
    const recentChats = result.reverse().join("\n");
    return recentChats;
  }

  public async seedChatHistory(
    seedContent: String,
    delimiter: string = "\n",
    personaKey: PersonaKey
  ) {
    const key = this.generateRedisPersonaKey(personaKey);
    if (await this.history.exists(key)) {
      console.log("User already has chat history");
      return;
    }

    const content = seedContent.split(delimiter);
    let counter = 0;
    for (const line of content) {
      await this.history.zadd(key, { score: counter, member: line });
      counter += 1;
    }
  }
}
