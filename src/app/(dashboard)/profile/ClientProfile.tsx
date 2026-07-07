"use client";

import { useEffect, useState } from "react";
import { updateProfile } from "@/app/actions/updateProfile";
import { changePassword } from "@/app/actions/changePassword";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";

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

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  async function onSubmitProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setErr(null);

    const formEl = e.currentTarget;
    const form = new FormData(formEl);

    const firstName = String(form.get("firstName") || "").trim();
    const lastName = String(form.get("lastName") || "").trim();
    const dateOfBirth = String(form.get("dateOfBirth") || "").trim();
    const gender = String(form.get("gender") || "").trim() as
      | "Male"
      | "Female"
      | "Other";
    const nationality = String(form.get("nationality") || "").trim();
    const residency = String(form.get("residency") || "").trim();
    const username = String(form.get("username") || "").trim();
    const primaryNumber = String(form.get("primaryNumber") || "").trim();
    const secondaryNumber1 = String(form.get("secondaryNumber1") || "").trim();
    const secondaryNumber2 = String(form.get("secondaryNumber2") || "").trim();
    const marketingOptIn = form.get("marketingOptIn") === "on";

    const res = await updateProfile(form);

    if (!(res as any)?.ok) {
      setErr((res as any)?.error || "Update failed");
      return;
    }

    setMsg("Profile updated successfully.");

    const authState = useAuthStore.getState();
    const currentUser = authState.user;

    if (currentUser) {
      useAuthStore.setState({
        user: {
          ...currentUser,
          firstName,
          lastName,
          dateOfBirth,
          gender,
          nationality,
          residency,
          username,
          primaryNumber,
          secondaryNumber1,
          secondaryNumber2,
          marketingOptIn,
        },
      });
    }
  }

  async function onSubmitPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setErr(null);

    const form = new FormData(e.currentTarget);
    const res = await changePassword(form);

    if ((res as any)?.ok) {
      setMsg("Password changed successfully.");
    } else {
      setErr((res as any)?.error || "Password change failed");
    }

    e.currentTarget.reset();
  }

  function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-semibold">My Profile</h1>

      {msg && (
        <div className="text-green-700 bg-green-50 border border-green-200 p-3 rounded">
          {msg}
        </div>
      )}

      {err && (
        <div className="text-red-700 bg-red-50 border border-red-200 p-3 rounded">
          {err}
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          <form
            onSubmit={onSubmitProfile}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="md:col-span-2 flex items-center gap-4">
              <img
                src={preview || "/avatar-placeholder.png"}
                alt="avatar"
                className="w-16 h-16 rounded-full object-cover border"
              />
              <div>
                <Label htmlFor="image">Profile picture</Label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={onAvatarChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                name="firstName"
                defaultValue={user.firstName}
                required
              />
            </div>

            <div>
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                name="lastName"
                defaultValue={user.lastName}
                required
              />
            </div>

            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                defaultValue={user.dateOfBirth}
                required
              />
            </div>

            <div>
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                name="gender"
                defaultValue={user.gender}
                className="w-full border rounded h-10 px-3 bg-background"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                name="nationality"
                defaultValue={user.nationality}
                required
              />
            </div>

            <div>
              <Label htmlFor="residency">Residency</Label>
              <Input
                id="residency"
                name="residency"
                defaultValue={user.residency}
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label>Email (read-only)</Label>
              <Input value={user.email} disabled />
            </div>

            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                defaultValue={user.username}
                required
              />
            </div>

            <div>
              <Label htmlFor="primaryNumber">Primary Number</Label>
              <Input
                id="primaryNumber"
                name="primaryNumber"
                defaultValue={user.primaryNumber}
                required
              />
            </div>

            <div>
              <Label htmlFor="secondaryNumber1">Secondary Number 1</Label>
              <Input
                id="secondaryNumber1"
                name="secondaryNumber1"
                defaultValue={user.secondaryNumber1}
              />
            </div>

            <div>
              <Label htmlFor="secondaryNumber2">Secondary Number 2</Label>
              <Input
                id="secondaryNumber2"
                name="secondaryNumber2"
                defaultValue={user.secondaryNumber2}
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-2">
              <input
                id="marketingOptIn"
                name="marketingOptIn"
                type="checkbox"
                defaultChecked={user.marketingOptIn}
              />
              <Label htmlFor="marketingOptIn">Subscribe to updates</Label>
            </div>

            <div className="md:col-span-2">
              <Button type="submit" className="w-full">
                Save Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Change Password</h2>

          <form
            onSubmit={onSubmitPassword}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
              />
            </div>

            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                required
              />
            </div>

            <div className="md:col-span-2">
              <Button type="submit" variant="outline" className="w-full">
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}