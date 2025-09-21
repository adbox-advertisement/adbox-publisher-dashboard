// ✅ Define as a constant object
export const ConnectionEnum = {
  connected: "connected",
  connecting: "connecting",
  reconnecting: "reconnecting",
  disconnected: "disconnected",
} as const;

// ✅ Create a union type from the values of the object
export type ConnectionEnum =
  (typeof ConnectionEnum)[keyof typeof ConnectionEnum];
