export default function AdminKnowledgePage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Chatbot Knowledge Base ({locale})</h1>
    </div>
  );
}
