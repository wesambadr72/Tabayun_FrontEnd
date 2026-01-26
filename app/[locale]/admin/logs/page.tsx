export default function AdminLogsPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Admin Activity Logs ({locale})</h1>
    </div>
  );
}
