document.addEventListener("submit", async function (event) {
  chrome.storage.local.get(["enabled"]).then((data) => {
    if (!data.enabled) {
      console.log("Privacy Shield is Disabled. Skipping data modification.");
      return; // skipp the modification when disabled
    }
    let formElements = event.target.elements;
    for (let elements of formElements) {
      let fieldName = elements.name.toLowerCase();
      let fieldType = element.type;

      //Exclude important fields for user functions (logging in, captcha ...)
      if (
        ["password", "email", "username", captcha].includes(fieldType) ||
        fieldName.includes("captcha")
      ) {
        continue; //skip privacy mods on these fields
      }
      if (fieldType === "text" || fieldType === "number") {
        applyPrivacy(element.value).then((newValue) => {
          element.value = newValue;
        });
      }
    }
  });
});
