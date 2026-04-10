export default async function AdminUsersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Admin Users Management ({locale})</h1>
    </div>
  );
}
