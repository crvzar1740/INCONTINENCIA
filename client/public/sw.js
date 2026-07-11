/* Suelo Firme — Service Worker for scheduled bladder notifications */

const NOTIF_TAG = "suelo-firme-bladder-reminder";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

/* Listen for messages from the main app */
self.addEventListener("message", (event) => {
  const { type, payload } = event.data || {};

  if (type === "SCHEDULE_NOTIF") {
    const { delayMs, title, body, icon } = payload;
    setTimeout(() => {
      self.registration.showNotification(title, {
        body,
        icon: icon || "/favicon.ico",
        tag: NOTIF_TAG,
        requireInteraction: false,
        silent: false,
        data: { url: "/diario" },
      });
    }, delayMs);
  }

  if (type === "CANCEL_NOTIF") {
    self.registration.getNotifications({ tag: NOTIF_TAG }).then((notifs) => {
      notifs.forEach((n) => n.close());
    });
  }
});

/* Tap on notification opens the diary */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/diario";
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(url) && "focus" in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    })
  );
});
