import { cn } from "@/lib/utils";

// ── Shared prose styles (must mirror editor's contentEditable styles) ─────────

const proseClasses = cn(
  "text-sm text-slate-800",
  "[&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h2]:mb-1",
  "[&_p]:leading-relaxed [&_p]:text-slate-700",
  "[&_blockquote]:border-l-4 [&_blockquote]:border-slate-200 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-slate-500",
  "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-0.5",
  "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-0.5",
  "[&_li]:leading-relaxed"
);

// ── Component ─────────────────────────────────────────────────────────────────

export interface RichTextViewerProps {
  html: string;
  className?: string;
}

export function RichTextViewer({ html, className }: RichTextViewerProps) {
  if (!html || html.trim() === "" || html === "<br>") {
    return (
      <p className="text-sm text-slate-400 italic">Nothing to preview yet.</p>
    );
  }

  return (
    <div
      className={cn(proseClasses, className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
