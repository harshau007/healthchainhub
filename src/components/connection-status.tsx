import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface ConnectionStatusProps {
  isConnected: boolean;
  lastUpdated: Date | null;
}

export function ConnectionStatus({
  isConnected,
  lastUpdated,
}: ConnectionStatusProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Badge
        variant={isConnected ? "default" : "destructive"}
        className={
          isConnected
            ? "h-5 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
            : ""
        }
      >
        <span
          className={`lg:mr-1.5 inline-block w-2 h-2 rounded-full ${
            isConnected ? "bg-white animate-pulse" : "bg-red-200"
          }`}
        ></span>
        <span className="hidden sm:inline">
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      </Badge>
      {lastUpdated && (
        <span className="hidden sm:inline text-muted-foreground">
          Updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
        </span>
      )}
    </div>
  );
}
