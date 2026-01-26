export default function DashboardPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard ({locale})</h1>
    </div>
  );
}
