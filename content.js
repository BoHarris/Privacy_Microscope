document.addEventListener("submit", async function (event) {
  chrome.storage.local.get(["enabled"]).then((data) => {
    if (!data.enabled) {
      console.log("Privacy Shield is Disabled. Skipping data modification.");
      return; // skipp the modification when disabled
    }
    let formElements = event.target.elements;
    let collectedData = {};

    for (let element of formElements) {
      let fieldName = element.name.toLowerCase();
      let fieldType = element.type;

      //Exclude important fields for user functions (logging in, captcha ...)
      if (
        ["password", "email", "username", captcha].includes(fieldType) ||
        fieldName.includes("captcha")
      ) {
        continue; //skip privacy mods on these fields
      }

      collectedData[fieldName] =
        element.value.length > 0 ? "Collected" : "Not Collected";

      if (fieldType === "text" || fieldType === "number") {
        applyPrivacy(element.value).then((newValue) => {
          element.value = newValue;
        });
      }
    }

    //Send Collected data to the backgroun script for logging
    chrome.runtime.sendMessage({
      type: "trackingDetected",
      data: collectedData,
    });
  });
});
