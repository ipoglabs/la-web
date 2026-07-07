"use client";

import { useState } from "react";
import { RichTextEditor } from "@/components/rich-text-editor/RichTextEditor";
import { RichTextViewer } from "@/components/rich-text-editor/RichTextViewer";

export default function RichTextEditorPage() {
  const [html, setHtml] = useState("");

  return (
    <main className="flex flex-1 flex-col items-center p-8">
      <div className="w-full max-w-5xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
            Rich Text Editor
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Compose below — the preview updates live.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Compose */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">
              Compose
            </p>
            <RichTextEditor
              value={html}
              onChange={setHtml}
              placeholder="Write something..."
            />
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">
              Preview
            </p>
            <div className="min-h-36 rounded-md border border-slate-100 bg-slate-50 px-4 py-3">
              <RichTextViewer html={html} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
