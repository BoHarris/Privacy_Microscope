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
        let logEntry = document.createElement("div");
        logEntry.className = "log";

        let domain = extractDomain(log.url);
        let shortenedUrl =
          log.url.length > 50
            ? `<span title ="${log.url}">${log.url.substring(0, 40)} ...</span>`
            : log.url;

        let headersHtml = log.headers
          ? `<pre><b>Tracking Headers:</b>\n${JSON.stringify(
              log.headers,
              null,
              2
            )}</pre>`
          : "<p><b> No headers captured. </b></p>";

        let formTrackingHtml = log.collectedFields
          ? `<pre> <b>Collected Form Data:</b>\n${JSON.stringify(
              log.collectedFields,
              null,
              2
            )}</pre>`
          : "<p><b>No form tracking detected.</b></p>";

        logEntry.innerHTML = `
      <div class ="timestamp">${log.time}</div>
      <div class="url"><b>Site:</b> ${domain}</div>
      ${headersHtml}
      ${formTrackingHtml}
       <hr> <!--Comment-->
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
