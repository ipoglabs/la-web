"use client";

import { useState } from "react";

import EmailEditForm from "./EmailEditForm";
import PhoneEditForm from "./PhoneEditForm";
import SecondaryPhoneForm from "./SecondaryPhoneForm";

import type { ProfileUser } from "../types";

export default function ContactEditForm({
  user,
}: {
  user: ProfileUser;
}) {

  const [active, setActive] = useState<
    null |
    "email" |
    "phone" |
    "secondary1" |
    "secondary2"
  >(null);

  return (
    <>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm">

        {/* Email */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 gap-4">
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-slate-500">
              Email Address
            </div>

            <div className="text-sm font-semibold text-slate-900 mt-0.5 truncate">
              {user.email || "—"}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActive("email")}
            className="shrink-0 text-xs font-semibold text-slate-500 border border-slate-200 px-3.5 py-1.5 rounded-lg hover:border-slate-400 hover:text-slate-800 transition"
          >
            Edit
          </button>
        </div>

        {/* Primary */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 gap-4">
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-slate-500">
              Primary Number
            </div>

            <div className="text-sm font-semibold text-slate-900 mt-0.5 truncate">
              {user.primaryNumber || "—"}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActive("phone")}
            className="shrink-0 text-xs font-semibold text-slate-500 border border-slate-200 px-3.5 py-1.5 rounded-lg hover:border-slate-400 hover:text-slate-800 transition"
          >
            Edit
          </button>
        </div>

        {/* Secondary 1 */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 gap-4">
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-slate-500">
              Secondary Number 1
            </div>

            <div className="text-sm font-semibold text-slate-900 mt-0.5 truncate">
              {user.secondaryNumber1 || "Not Added"}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActive("secondary1")}
            className="shrink-0 text-xs font-semibold text-slate-500 border border-slate-200 px-3.5 py-1.5 rounded-lg hover:border-slate-400 hover:text-slate-800 transition"
          >
            {user.secondaryNumber1 ? "Edit" : "Add"}
          </button>
        </div>

        {/* Secondary 2 */}
        <div className="flex items-center justify-between px-4 py-3.5 gap-4">
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-slate-500">
              Secondary Number 2
            </div>

            <div className="text-sm font-semibold text-slate-900 mt-0.5 truncate">
              {user.secondaryNumber2 || "Not Added"}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActive("secondary2")}
            className="shrink-0 text-xs font-semibold text-slate-500 border border-slate-200 px-3.5 py-1.5 rounded-lg hover:border-slate-400 hover:text-slate-800 transition"
          >
            {user.secondaryNumber2 ? "Edit" : "Add"}
          </button>
        </div>

      </div>

      {/* EMAIL */}
      <EmailEditForm
        open={active === "email"}
        onClose={() => setActive(null)}
        user={user}
      />

      {/* PRIMARY */}
      <PhoneEditForm
        open={active === "phone"}
        onClose={() => setActive(null)}
        user={user}
      />

      {/* SECONDARY 1 */}
      <SecondaryPhoneForm
        open={active === "secondary1"}
        onClose={() => setActive(null)}
        user={user}
        field="secondaryNumber1"
      />

      {/* SECONDARY 2 */}
      <SecondaryPhoneForm
        open={active === "secondary2"}
        onClose={() => setActive(null)}
        user={user}
        field="secondaryNumber2"
      />

    </>
  );
}