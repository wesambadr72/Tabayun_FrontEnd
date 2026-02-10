export default function BookmarksPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">My Bookmarks ({locale})</h1>
    </div>
  );
}
