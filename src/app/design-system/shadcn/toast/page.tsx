"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { TickIcon, ErrorIcon } from "@/components/icons/la-icons";

export default function ToastDemoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Toast — demo</h1>
        <p className="text-sm text-slate-600">Examples using the project's Sonner wrapper.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => toast('Top center toast — simple message')}>
          From Top — Simple
        </Button>

        <Button
          onClick={() =>
            toast('With action button', {
              action: { label: 'Undo', onClick: () => toast('Undo action') },
            })
          }
        >
          With Action
        </Button>

        <Button onClick={() => toast.success('Success!', { description: 'Operation completed', icon: <TickIcon className="h-5 w-5" /> })}>
          With Icon
        </Button>

        <Button variant="destructive" onClick={() => toast.error('Error occurred', { description: 'Something went wrong', icon: <ErrorIcon className="h-5 w-5" /> })}>
          Error Icon
        </Button>
      </div>
    </div>
  );
}
