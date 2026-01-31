"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteUser } from "../../../../actions/deleteUser";

export default function AdminUserActions({
  userId,
  userEmail,
}: {
  userId: string;
  userEmail?: string;
}) {
  const [pending, start] = useTransition();
  const router = useRouter();

  const onDelete = () => {
    const ok = confirm(
      `Delete this user permanently?\n\nUser: ${userEmail || userId}\n\nThis cannot be undone.`
    );
    if (!ok) return;

    start(async () => {
      const res = await deleteUser(userId);
      if (!res?.ok) {
        alert(res?.error || "Delete failed");
        return;
      }

      router.push("/admin/users");
      router.refresh();
    });
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={pending}
      onClick={onDelete}
      title="Delete this user"
    >
      {pending ? "Deleting..." : "Delete User"}
    </Button>
  );
}
