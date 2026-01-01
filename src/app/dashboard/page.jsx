import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import BookingForm from "@/components/BookingForm";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p>Unauthorized</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <BookingForm user={session.user} />
    </div>
  );
}
