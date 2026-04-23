// src/utils/generateApiKey.js
import crypto from "crypto";

export function generateApiKey() {
  // 32 bytes = 64 hex chars (256-bit entropy)
  const raw = crypto.randomBytes(32).toString("hex");

  // Format: ppk_live_xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx
  const formatted = raw.match(/.{1,8}/g).join("-");

  return `ppk_live_${formatted}`;
}
