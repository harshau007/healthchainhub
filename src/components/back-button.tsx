import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface BackButtonProps {
  href: string;
  label: string;
}

export function BackButton({ href, label }: BackButtonProps) {
  return (
    <div className="mb-6">
      <Link href={href}>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          {label}
        </Button>
      </Link>
    </div>
  );
}
