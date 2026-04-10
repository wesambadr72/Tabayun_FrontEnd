export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Admin Dashboard ({locale})</h1>
    </div>
  );
}
