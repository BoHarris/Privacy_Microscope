console.log("Privacy Shield Extension Service Worker Loaded");

self.addEventListener("install", () => {
  console.log("Service Worker Installed.");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker Activated.");
  event.waitUntil(self.clients.claim());
});

//Apply tracking rules

chrome.declarativeNetRequest
  .updateDynamicRules({
    removeRuleIds: [1],
    addRules: [
      {
        id: 1,
        priority: 1,
        action: {
          type: "modifyHeaders",
          requestHeaders: [
            { header: "Referer", operation: "set", value: "Logged" },
            { header: "User-Agent", operation: "set", value: "Logged" },
          ],
        },
        condition: {
          urlFilter: "*",
          resourceTypes: ["main_frame", "xmlhttprequest"],
        },
      },
    ],
  })
  .then(() => console.log("Tracking rule applied"))
  .catch((error) => console.error("Error applying tracking rule:", error));

//Listen for form tracking data sent to content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "trackingDetected") {
    console.log("Form Tracking Detected:", message.data);

    //Merge collected form tracking data
    chrome.storage.local.get(["trackingLogs"], function (data) {
      let logs = data.trackingLogs || [];
      logs.push({
        url: sender.url || (sender.tab && sender.tab.url) || "Unknown URL",
        collectedFields: message.data, // store what field is collected
        time: new Date().toLocaleString(),
      });
      if (logs.length > 50) logs.shift();

      chrome.storage.local.set({ trackingLogs: logs }, () => {
        console.log("Tracking log updated successfully");
      });
    });
  }
});
