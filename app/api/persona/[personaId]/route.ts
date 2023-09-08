import prismadb from "@/lib/prismadb";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
interface Params {
  personaId: string;
}

export async function PATCH(req: Request, { params }: { params: Params }) {
  try {
    const body = await req.json();
    const user = await currentUser();
    const { name, description, instructions, seed, categoryId, src } = body;

    if (!params.personaId) {
      return new NextResponse("Persona ID is required", { status: 400 });
    }

    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!src || !name || description || !instructions || !seed || !categoryId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    //TODO check for subscription
    const persona = await prismadb.persona.update({
      where: {
        id: params.personaId,
      },
      data: {
        categoryId,
        userId: user.id,
        userName: user.firstName,
        src,
        name,
        description,
        instructions,
        seed,
      },
    });

    return NextResponse.json(persona);
  } catch (error) {
    console.log(error, "Persona Error");
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Params }) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const persona = await prismadb.persona.delete({
      where: {
        userId,
        id: params.personaId,
      },
    });

    return NextResponse.json({
      message: "Persona Deleted Successfully",
      persona: persona,
    });
  } catch (error) {
    console.log("[PERSONA DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
