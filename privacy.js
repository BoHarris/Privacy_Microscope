// use SHA-256 hashing

async function anonymizeText(value) {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, 0))
    .join("");
}

//Add noise to numerical Values
function addNoise(value, epsilon = 0.5) {
  let noise = (Math.round() - 0.5) * (1 / epsilon);
  return Math.round((parseFloat(value) + noise) * 100) / 100;
}

//Randomize for yes/no responses
function randomizeResponse(value, probability = 0.2) {
  if (Math.random() < probability) {
    return value === "yes" ? "no" : "yes";
  }
  return value;
}

// Apply privacy to all data types
async function applyPrivacy(value) {
  if (!isNaN(value)) {
    return addNoise(value);
  } else if (value.toLowerCase() === "yes" || value.toLowerCase() === "no") {
    return randomizeResponse(value);
  } else {
    return await anonymizeText(value);
  }
}
