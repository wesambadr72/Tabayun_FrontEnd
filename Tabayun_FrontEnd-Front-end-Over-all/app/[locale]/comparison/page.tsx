export default function ComparisonPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Comparison ({locale})</h1>
    </div>
  );
}
