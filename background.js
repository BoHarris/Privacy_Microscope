console.log("Privacy Shield Extension Service Worker Loaded");

self.addEventListener("install", () => {
  console.log("Service Worker Installed.");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker Activated.");
  event.waitUntil(self.clients.claim());
});

chrome.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    let trackingHeaders = {};
    let headersToCapture = ["Referer", "User-Agent", "Cookie"];

    for (let header of details.requestHeaders) {
      if (headersToCapture.includes(header.name)) {
        trackingHeaders[header.name] = header.value;
      }
    }

    if (Object.keys(trackingHeaders).length > 0) {
      console.log("Captured Tracking Headers:", trackingHeaders);

      // Store captured headers
      chrome.storage.local.get(["trackingLogs"], function (data) {
        let logs = data.trackingLogs || [];
        logs.push({
          url: details.url,
          headers: trackingHeaders,
          time: new Date().toLocaleString(),
        });

        // Keep only the last 50 logs
        if (logs.length > 50) logs.shift();

        chrome.storage.local.set({ trackingLogs: logs });
      });
    }
  },
  { urls: ["<all_urls>"] },
  ["requestHeaders"]
);
