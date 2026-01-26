export default function AdminLawsPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Admin Laws Management ({locale})</h1>
    </div>
  );
}
