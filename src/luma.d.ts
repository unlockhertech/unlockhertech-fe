export {};

declare global {
  interface Window {
    LumaCheckout?: {
      open?: (options: { eventId: string }) => void;
    };
    luma?: {
      checkout?: (options: { eventId: string }) => void;
      openCheckout?: (options: { eventId: string }) => void;
    };
  }
}
