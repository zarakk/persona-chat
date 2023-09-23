import prismadb from "@/lib/prismadb";
import PersonaForm from "./components/PersonaForm";
import { auth, redirectToSignIn } from "@clerk/nextjs";

interface PersonaIdProps {
  params: {
    personaId: string;
  };
}

const PersonaId = async ({ params }: PersonaIdProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirectToSignIn();
  }
  //TODO:  Check subscription
  const persona = await prismadb.persona.findUnique({
    where: {
      id: params.personaId,
      userId,
    },
  });

  const categories = await prismadb.category.findMany();

  return <PersonaForm initialData={persona} categories={categories} />;
};

export default PersonaId;
