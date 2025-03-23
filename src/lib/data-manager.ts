import type { HospitalData } from "@/lib/types";

interface EventCallbacks {
  onData: (data: HospitalData) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (error: Error) => void;
}

export class DataManager {
  private eventSource: EventSource | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 60000; // 5 seconds

  constructor() {
    this.eventSource = null;
  }

  subscribeToEvents(callbacks: EventCallbacks): () => void {
    try {
      this.connect(callbacks);

      return () => {
        this.closeConnection();
      };
    } catch (error) {
      console.error("Error setting up EventSource:", error);
      callbacks.onError?.(new Error("Failed to set up data connection"));
      return () => {};
    }
  }

  private connect(callbacks: EventCallbacks) {
    this.closeConnection(); // Close any existing connection

    try {
      this.eventSource = new EventSource(
        process.env.NODE_ENV == "development"
          ? "http://localhost:4000/events"
          : "https://healthchainhub.onrender.com/events"
      );

      this.eventSource.onopen = () => {
        this.reconnectAttempts = 0;
        callbacks.onConnected?.();
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as HospitalData;
          callbacks.onData(data);
        } catch (error) {
          console.error("Error parsing event data:", error);
          callbacks.onError?.(new Error("Failed to parse data"));
        }
      };

      this.eventSource.onerror = (error) => {
        console.error("EventSource error:", error);
        this.closeConnection();
        callbacks.onDisconnected?.();

        // Try to reconnect with exponential backoff
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          const delay =
            this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts);
          this.reconnectAttempts++;

          this.reconnectTimer = setTimeout(() => {
            this.connect(callbacks);
          }, delay);
        } else {
          callbacks.onError?.(
            new Error("Maximum reconnection attempts reached")
          );
        }
      };
    } catch (error) {
      console.error("Error creating EventSource:", error);
      callbacks.onError?.(new Error("Failed to connect to data stream"));
    }
  }

  private closeConnection() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}
