"use client";

import { useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { toast } from "sonner";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { LaButton, LaField, LaInput, LaTextarea } from "@/components/la";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  sellerName?: string;
};

const MAX_CHARS = 500;

export function MessageResponsiveDialog({ sellerName = "Seller" }: Props) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const isDesktop = useMediaQuery("(min-width: 768px)");

  function handleSend() {
    // TODO: wire API POST /api/messages
    setOpen(false);
    setSubject("");
    setMessage("");
    toast.success(`Message sent to ${sellerName}`);
  }

  const canSend = subject.trim().length > 0 && message.trim().length > 0;

  // ── Trigger ──────────────────────────────────────────────────────────────
  const trigger = (
    <LaButton intent="primary" size="big" className="w-full">
      <MessageCircle className="size-4" />
      Send a message
    </LaButton>
  );

  // ── Form body ─────────────────────────────────────────────────────────────
  const body = (
    <div className="px-5 py-4 space-y-4">
      {/* To */}
      <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 w-6 shrink-0">To</span>
        <span className="font-medium text-slate-700">{sellerName}</span>
      </div>

      {/* Subject */}
      <LaField name="message-subject" label="Subject">
        <LaInput
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. Enquiry about your property listing"
        />
      </LaField>

      {/* Message */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="message-body" className="block text-sm font-semibold text-slate-500 uppercase tracking-wide">
            Message
          </label>
          <span
            aria-live="polite"
            className={`text-sm tabular-nums ${message.length > MAX_CHARS * 0.9 ? "text-rose-500" : "text-slate-500"}`}
          >
            {message.length}/{MAX_CHARS}
          </span>
        </div>
        <LaTextarea
          id="message-body"
          value={message}
          onChange={(e) => {
            if (e.target.value.length <= MAX_CHARS) setMessage(e.target.value);
          }}
          placeholder={`Hi ${sellerName}, I'm interested in one of your listings...`}
          rows={5}
        />
      </div>
    </div>
  );

  // ── Footer ────────────────────────────────────────────────────────────────
  const footer = (
    <div className="px-5 pb-5 pt-3 flex gap-3">
      <LaButton intent="outline" size="big" className="flex-none" onClick={() => setOpen(false)}>
        Cancel
      </LaButton>
      <LaButton intent="primary" size="big" className="flex-1" onClick={handleSend} disabled={!canSend}>
        <Send className="size-4" />
        Send message
      </LaButton>
    </div>
  );

  // ── Close button ──────────────────────────────────────────────────────────
  const closeBtn = (
    <LaButton intent="ghost" size="compact" iconOnly onClick={() => setOpen(false)} aria-label="Close">
      <X className="size-4" />
    </LaButton>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="max-w-md w-full p-0 gap-0 rounded-2xl overflow-hidden">
          <DialogHeader className="flex flex-row items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100">
            <DialogTitle className="text-base font-semibold text-slate-900">
              Message {sellerName}
            </DialogTitle>
            {closeBtn}
          </DialogHeader>
          {body}
          {footer}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} dismissible={false}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="max-h-[92dvh] flex flex-col rounded-t-2xl">
        <DrawerHeader className="flex flex-row items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100">
          <DrawerTitle className="text-base font-semibold text-slate-900">
            Message {sellerName}
          </DrawerTitle>
          {closeBtn}
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto">
          {body}
        </div>
        <DrawerFooter className="p-0">{footer}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default MessageResponsiveDialog;
