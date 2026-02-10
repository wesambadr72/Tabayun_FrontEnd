export default function AdminDashboardPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Admin Dashboard ({locale})</h1>
    </div>
  );
}
