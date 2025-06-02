// utils/notification.ts
"use client";
import { notification } from "antd";

type NotificationType = "success" | "info" | "warning" | "error";

export const notify = (
  type: NotificationType,
  message: string,
  description?: string,
  placement: "topRight" | "topLeft" | "bottomLeft" | "bottomRight" = "topRight"
) => {
  notification[type]({
    message,
    description,
    placement,
  });
};
