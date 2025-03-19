document.addEventListener("DOMContentLoaded", function () {
  let logsContainer = document.getElementById("logs");
  let clearLogsButton = document.getElementById("clearLogs");

  // Ensure logsContainer exists before using it
  if (!logsContainer) {
    console.error("logsContainer element not found in popup.html");
    return;
  }

  function extractDomain(url) {
    try {
      let urlObj = new URL(url);
      return urlObj.hostname;
    } catch (error) {
      return "Unknown Domain";
    }
  }
  function loadLogs() {
    // Ensure chrome.storage.local is available
    if (!chrome.storage || !chrome.storage.local) {
      console.error("chrome.storage.local is undefined. Check permissions.");
      return;
    }

    chrome.storage.local.get(["trackingLogs"], function (data) {
      let logs = data.trackingLogs || [];

      if (logs.length === 0) {
        logsContainer.innerHTML = "<p>No tracking headers captured yet.</p>";
        return;
      }

      logsContainer.innerHTML = "";
      logs.forEach((log) => {
        let domain = extractDomain(log.url);
        let logEntry = document.createElement("div");
        logEntry.className = "log";
        logEntry.innerHTML = `
          <div class="timestamp">${log.time}</div>
          <div class="url"><b>Destination:</b>${domain}</div>
          <div class="url">${log.url}</div>
          <pre>${JSON.stringify(log.headers, null, 2)}</pre>
        `;
        logsContainer.appendChild(logEntry);
      });
    });
  }

  // Load logs when popup opens
  loadLogs();

  // Clear logs when requested by user (check if clearLogsButton exists)
  if (clearLogsButton) {
    clearLogsButton.addEventListener("click", function () {
      chrome.storage.local.set({ trackingLogs: [] }, function () {
        loadLogs();
      });
    });
  } else {
    console.error("clearLogsButton element not found in popup.html");
  }
});
