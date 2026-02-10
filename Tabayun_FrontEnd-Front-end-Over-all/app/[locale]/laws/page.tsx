export default function LawsPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Laws List ({locale})</h1>
    </div>
  );
}
