export default function AdminUsersPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Admin Users Management ({locale})</h1>
    </div>
  );
}
