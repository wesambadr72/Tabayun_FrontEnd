import Navbar from "@/components/Navbar";

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl">Dashboard</h1>
        <p>Dashboard content here</p>
      </div>
    </>
  );
}
