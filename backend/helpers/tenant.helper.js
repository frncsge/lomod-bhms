import crypto from "crypto";

export const generateTenantUsername = (user, suffixSize = 2) => {
  const randomSuffix = crypto.randomBytes(suffixSize).toString("hex");
  const firstName = user.firstName.trim().toLowerCase().replace(/\s+/, "_");
  const lastName = user.lastName.trim().toLowerCase().replace(/\s+/, "");

  return `${lastName}.${firstName}${randomSuffix}`;
};
