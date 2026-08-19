import EditForm from "../EditForm";

export default async function EditFormPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: id } = await params;
  return <EditForm id={id} />;
}
