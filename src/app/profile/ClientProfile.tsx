"use client";

import { useState } from "react";
import { updateProfile } from "@/app/actions/updateProfile";
import { changePassword } from "@/app/actions/changePassword";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type UserDTO = {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  nationality: string;
  residency: string;
  email: string;
  username: string;
  primaryNumber: string;
  secondaryNumber1: string;
  secondaryNumber2: string;
  role: string;
  image: string;
  marketingOptIn: boolean;
};

export default function ClientProfile({ user }: { user: UserDTO }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [preview, setPreview] = useState<string>(user.image || "");

  async function onSubmitProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setErr(null);

    const form = new FormData(e.currentTarget);
    const res = await updateProfile(form);
    if ((res as any)?.ok) setMsg("Profile updated successfully.");
    else setErr((res as any)?.error || "Update failed");
  }

  async function onSubmitPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    const form = new FormData(e.currentTarget);
    const res = await changePassword(form);
    if ((res as any)?.ok) setMsg("Password changed successfully.");
    else setErr((res as any)?.error || "Password change failed");
    (e.currentTarget as HTMLFormElement).reset();
  }

  function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-semibold">My Profile</h1>

      {msg && <div className="text-green-700 bg-green-50 border border-green-200 p-3 rounded">{msg}</div>}
      {err && <div className="text-red-700 bg-red-50 border border-red-200 p-3 rounded">{err}</div>}

      <Card>
        <CardContent className="p-6">
          <form onSubmit={onSubmitProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Avatar */}
            <div className="md:col-span-2 flex items-center gap-4">
              <img
                src={preview || "/avatar-placeholder.png"}
                alt="avatar"
                className="w-16 h-16 rounded-full object-cover border"
              />
              <div>
                <Label htmlFor="image">Profile picture</Label>
                <Input id="image" name="image" type="file" accept="image/*" onChange={onAvatarChange} />
              </div>
            </div>

            <div>
              <Label>First name</Label>
              <Input name="firstName" defaultValue={user.firstName} required />
            </div>
            <div>
              <Label>Last name</Label>
              <Input name="lastName" defaultValue={user.lastName} required />
            </div>

            <div>
              <Label>Date of Birth</Label>
              <Input name="dateOfBirth" type="date" defaultValue={user.dateOfBirth} required />
            </div>
            <div>
              <Label>Gender</Label>
              <select name="gender" defaultValue={user.gender} className="w-full border rounded h-10 px-3">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <Label>Nationality</Label>
              <Input name="nationality" defaultValue={user.nationality} required />
            </div>
            <div>
              <Label>Residency</Label>
              <Input name="residency" defaultValue={user.residency} required />
            </div>

            <div className="md:col-span-2">
              <Label>Email (read-only)</Label>
              <Input defaultValue={user.email} disabled />
            </div>

            <div>
              <Label>Username</Label>
              <Input name="username" defaultValue={user.username} required />
            </div>

            <div>
              <Label>Primary Number</Label>
              <Input name="primaryNumber" defaultValue={user.primaryNumber} required />
            </div>

            <div>
              <Label>Secondary Number 1</Label>
              <Input name="secondaryNumber1" defaultValue={user.secondaryNumber1} />
            </div>
            <div>
              <Label>Secondary Number 2</Label>
              <Input name="secondaryNumber2" defaultValue={user.secondaryNumber2} />
            </div>

            <div className="md:col-span-2 flex items-center gap-2">
              <input id="marketingOptIn" name="marketingOptIn" type="checkbox" defaultChecked={user.marketingOptIn} />
              <Label htmlFor="marketingOptIn">Subscribe to updates</Label>
            </div>

            <div className="md:col-span-2">
              <Button type="submit" className="w-full">Save Profile</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Change Password</h2>
          <form onSubmit={onSubmitPassword} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Current Password</Label>
              <Input name="currentPassword" type="password" required />
            </div>
            <div>
              <Label>New Password</Label>
              <Input name="newPassword" type="password" required />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" variant="outline" className="w-full">Update Password</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
