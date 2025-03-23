import { type ClassValue, clsx } from "clsx";
import { format, formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, "MMM d, yyyy");
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return format(date, "h:mm a");
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
}

type VitalSignType =
  | "heartRate"
  | "temperature"
  | "bloodPressure"
  | "respiratoryRate"
  | "oxygenSaturation";

export function getVitalStatusColor(
  type: VitalSignType,
  value: number | string
): string {
  switch (type) {
    case "heartRate":
      const hr = Number(value);
      if (hr < 60) return "text-blue-500 dark:text-blue-400";
      if (hr > 100) return "text-red-500 dark:text-red-400";
      return "text-green-500 dark:text-green-400";

    case "temperature":
      const temp = Number(value);
      if (temp < 36) return "text-blue-500 dark:text-blue-400";
      if (temp > 38) return "text-red-500 dark:text-red-400";
      return "text-green-500 dark:text-green-400";

    case "bloodPressure":
      const bp = typeof value === "string" ? value.split("/")[0] : value;
      const systolic = Number(bp);
      if (systolic < 90) return "text-blue-500 dark:text-blue-400";
      if (systolic > 140) return "text-red-500 dark:text-red-400";
      return "text-green-500 dark:text-green-400";

    case "respiratoryRate":
      const rr = Number(value);
      if (rr < 12) return "text-blue-500 dark:text-blue-400";
      if (rr > 20) return "text-red-500 dark:text-red-400";
      return "text-green-500 dark:text-green-400";

    case "oxygenSaturation":
      const o2 = Number(value);
      if (o2 < 90) return "text-red-500 dark:text-red-400";
      if (o2 < 95) return "text-amber-500 dark:text-amber-400";
      return "text-green-500 dark:text-green-400";

    default:
      return "text-foreground";
  }
}

export function getVitalStatusBgColor(
  type: VitalSignType,
  value: number | string
): string {
  switch (type) {
    case "heartRate":
      const hr = Number(value);
      if (hr < 60) return "bg-blue-500 dark:bg-blue-600";
      if (hr > 100) return "bg-red-500 dark:bg-red-600";
      return "bg-green-500 dark:bg-green-600";

    case "temperature":
      const temp = Number(value);
      if (temp < 36) return "bg-blue-500 dark:bg-blue-600";
      if (temp > 38) return "bg-red-500 dark:bg-red-600";
      return "bg-green-500 dark:bg-green-600";

    case "bloodPressure":
      const bp = typeof value === "string" ? value.split("/")[0] : value;
      const systolic = Number(bp);
      if (systolic < 90) return "bg-blue-500 dark:bg-blue-600";
      if (systolic > 140) return "bg-red-500 dark:bg-red-600";
      return "bg-green-500 dark:bg-green-600";

    case "respiratoryRate":
      const rr = Number(value);
      if (rr < 12) return "bg-blue-500 dark:bg-blue-600";
      if (rr > 20) return "bg-red-500 dark:bg-red-600";
      return "bg-green-500 dark:bg-green-600";

    case "oxygenSaturation":
      const o2 = Number(value);
      if (o2 < 90) return "bg-red-500 dark:bg-red-600";
      if (o2 < 95) return "bg-amber-500 dark:bg-amber-600";
      return "bg-green-500 dark:bg-green-600";

    default:
      return "bg-primary";
  }
}
