export default async function AdminKnowledgePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Chatbot Knowledge Base ({locale})</h1>
    </div>
  );
}
