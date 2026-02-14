import crypto from "crypto";

export const generateTenantUsername = (user, suffixSize = 2) => {
  const randomSuffix = crypto.randomBytes(suffixSize).toString("hex");
  const username = `${user.lastName.trim().replace(/\s+/g, "")}.${user.firstName.trim().replace(/\s+/g, "_")}${randomSuffix}`;

  return username;
};
