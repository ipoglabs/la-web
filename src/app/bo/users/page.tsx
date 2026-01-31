// src/app/admin/users/page.tsx
import connectDB from "@/config/database";
import User from "@/models/user";
import Link from "next/link";

export default async function AdminUsersPage() {
  await connectDB();

  const users = await User.find()
    .select("firstName lastName email role createdAt")
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="bg-white rounded shadow">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u: any) => (
            <tr key={u._id} className="border-b">
              <td>{u.firstName} {u.lastName}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{new Date(u.createdAt).toLocaleDateString()}</td>
              <td>
                <Link
                  href={`/bo/users/${u._id}`}
                  className="text-blue-600 underline"
                >
                  View Ads
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
