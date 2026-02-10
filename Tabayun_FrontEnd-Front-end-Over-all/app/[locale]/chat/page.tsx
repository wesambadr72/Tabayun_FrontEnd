export default function ChatPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Chat ({locale})</h1>
    </div>
  );
}
