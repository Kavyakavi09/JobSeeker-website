'use client';
import JobOpenings from '@/components/JobOpenings';
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter()

  const signOut = () => {
    localStorage.removeItem("token");
    router.push("/signin")
  };


  return (
      <div className="relative min-h-screen p-4">
      <button
        onClick={signOut}
        className="absolute top-4 right-4 bg-gray-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
      >
        Sign Out
      </button>
      <JobOpenings />
    </div>
  );
};

export default Dashboard;
