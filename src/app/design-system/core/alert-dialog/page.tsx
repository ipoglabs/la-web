"use client";

import LaSection from "@/components/la/la-section";
import {
  LaText,
  LaButton,
  LaAlertDialog,
  LaAlertDialogTrigger,
  LaAlertDialogContent,
  LaAlertDialogHeader,
  LaAlertDialogFooter,
  LaAlertDialogTitle,
  LaAlertDialogDescription,
  LaAlertDialogAction,
  LaAlertDialogCancel,
} from "@/components/la";

export default function AlertDialogPage() {
  return (
    <>
      <LaSection title="Alert Dialog">
        <LaText type="small" as="p" className="text-sm text-slate-500">
          Confirmation dialog for destructive or hard-to-reverse actions.
          Action/Cancel render as LaButton, so intent follows the same rules
          as everywhere else — danger for destructive, primary/outline for
          neutral confirmations.
        </LaText>

        <div className="flex flex-wrap gap-3">
          <LaAlertDialog>
            <LaAlertDialogTrigger asChild>
              <LaButton intent="danger">Delete post</LaButton>
            </LaAlertDialogTrigger>
            <LaAlertDialogContent>
              <LaAlertDialogHeader>
                <LaAlertDialogTitle>Delete this post?</LaAlertDialogTitle>
                <LaAlertDialogDescription>
                  This can&apos;t be undone. The listing will be removed
                  immediately and its images deleted.
                </LaAlertDialogDescription>
              </LaAlertDialogHeader>
              <LaAlertDialogFooter>
                <LaAlertDialogCancel>Cancel</LaAlertDialogCancel>
                <LaAlertDialogAction intent="danger">Delete</LaAlertDialogAction>
              </LaAlertDialogFooter>
            </LaAlertDialogContent>
          </LaAlertDialog>

          <LaAlertDialog>
            <LaAlertDialogTrigger asChild>
              <LaButton intent="outline">Share contact information?</LaButton>
            </LaAlertDialogTrigger>
            <LaAlertDialogContent>
              <LaAlertDialogHeader>
                <LaAlertDialogTitle>Share contact information?</LaAlertDialogTitle>
                <LaAlertDialogDescription>
                  Your message looks like it contains a phone number or
                  email. Only share contact details with people you trust.
                </LaAlertDialogDescription>
              </LaAlertDialogHeader>
              <LaAlertDialogFooter>
                <LaAlertDialogCancel>Edit message</LaAlertDialogCancel>
                <LaAlertDialogAction>Send anyway</LaAlertDialogAction>
              </LaAlertDialogFooter>
            </LaAlertDialogContent>
          </LaAlertDialog>
        </div>
      </LaSection>
    </>
  );
}
