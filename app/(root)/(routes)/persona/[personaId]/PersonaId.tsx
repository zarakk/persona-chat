import prismadb from "@/lib/prismadb";
import PersonaForm from "./components/PersonaForm";

interface PersonaIdProps {
  params: {
    personaId: string;
  };
}

const PersonaId = async ({ params }: PersonaIdProps) => {
  //TODO:  Check subscription
  const persona = await prismadb.persona.findUnique({
    where: {
      id: params.personaId,
    },
  });
  const categories = await prismadb.category.findMany();

  return <PersonaForm initialData={persona} categories={categories} />;
};

export default PersonaId;
