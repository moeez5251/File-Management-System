import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FileUp } from "lucide-react";

const MESSAGES = [
  "Hang tight",
  "Still working on it",
  "This can take a moment",
  "Almost there",
];

function UploadDialog({ open, onOpenChange }) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!open) return;
    setMessageIndex(0);
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % MESSAGES.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="w-[90%] max-w-xs rounded-3xl">
        <DialogHeader>
          <DialogTitle className="sr-only">Uploading</DialogTitle>
          <DialogDescription className="sr-only">
            Your file is being uploaded, please wait.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-1 py-2">
          <div className="relative h-14 w-14 mb-3">
            <svg
              width="56"
              height="56"
              viewBox="0 0 56 56"
              className="animate-spin"
              style={{ animationDuration: "1.4s" }}
            >
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="gray"
                strokeWidth="3"
              />
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="#fa7275"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="60 90.7"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <FileUp className="h-[18px] w-[18px] text-primary" />
            </div>
          </div>

          <p className="text-[15px] font-semibold text-center">
            Uploading your file
          </p>
          <p className="text-[13px] text-muted-foreground text-center min-h-[18px] transition-opacity">
            {MESSAGES[messageIndex]}
          </p>
        </div>
        <div className="bg-white p-6 absolute top-2.5 right-2.5 z-40 pointer-events-none cursor-auto">

        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UploadDialog;