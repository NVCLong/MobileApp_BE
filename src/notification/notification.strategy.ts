export interface NotificationStrategy{
  send(payload: NotificationPayload): Promise<void>;
}

export interface NotificationPayload {
  type: "email" | 'websocket'; // The type of notification
  target: string; // email or websocket channel
  message: string; // The notification message
  additionalData?: any; // Optional data like metadata, attachments, etc.
}