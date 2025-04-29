"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  label: string;
}

export function BackButton({ label }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (document.referrer) {
      router.back();
    } else {
      router.push("/");
    }
  };
  return (
    <div className="mb-6">
      <Button
        variant="ghost"
        size="sm"
        className="gap-1 text-muted-foreground hover:text-foreground hover:cursor-pointer"
        onClick={handleBack}
      >
        <ChevronLeft className="h-4 w-4" />
        {label}
      </Button>
    </div>
  );
}
