//future francis, this is past francis. you need to work on this file

import { getUserById } from "../models/users.model.js";
import { generateTenantUsername } from "../helpers/tenant.helper.js";
import { sendSetPasswordLink } from "../helpers/mailer.helper.js";
import { capitalizeWords } from "../helpers/string.helper.js";

export const createTenantAccount = async (req, res) => {
  const firstName = capitalizeWords(req.body.firstName);
  const lastName = capitalizeWords(req.body.lastName);
  const { phoneNumber } = req.body;

  if (!firstName || !lastName)
    return res
      .status(400)
      .json({ message: "First and last names of tenant is required" });

  try {
    const username = generateTenantUsername({ firstName, lastName });
    const newTenant = { username, firstName, lastName, phoneNumber };

    //get landlord email so we can send the set password link to it
    const data = await getUserById(req.user.sub);
    const { email } = data;

    const removeThis = await sendSetPasswordLink(email, newTenant);

    res.status(200).json({ message: `Set password link sent ${removeThis}` });
  } catch (error) {
    console.error("Error creating new tenant account:", error);
    res.status(500).json({ message: "Server error" });
  }
};
