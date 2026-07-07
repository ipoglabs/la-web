"use client";
import React, { useState } from "react";
import { GoodToKnowEditor, GoodToKnowUserView } from "@/components/good-to-know/GoodToKnow";
import LaSection from "@/components/la/la-section";
import { LaText } from "@/components/la/la-text";

export default function GoodToKnowDemoPage() {
  const [points, setPoints] = useState([
    { label: "Parking", value: "Available" },
    { label: "Security", value: "24/7 CCTV" },
    { label: "", value: "" },
  ]);
  const [title, setTitle] = useState("Good To Know");

  return (
    <>
      <LaSection title="Good To Know – Editor">
        <LaText type="small" as="p" className="text-slate-500">
          Sellers can add any custom point that&apos;s important for buyers.
        </LaText>
        <GoodToKnowEditor
          maxPoints={8}
          initialPoints={points}
          onChange={setPoints}
          onTitleChange={setTitle}
        />
      </LaSection>

      <LaSection title="Good To Know – User View">
        <LaText type="small" as="p" className="text-slate-500">
          How buyers see the filled-in details.
        </LaText>
        <GoodToKnowUserView points={points} title={title} />
      </LaSection>
    </>
  );
}
