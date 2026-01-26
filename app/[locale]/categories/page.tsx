export default function CategoriesPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Law Categories ({locale})</h1>
    </div>
  );
}
