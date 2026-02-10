export default function LawDetailPage({ 
  params: { locale, id } 
}: { 
  params: { locale: string; id: string } 
}) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Law Detail ({id}) in {locale}</h1>
    </div>
  );
}
