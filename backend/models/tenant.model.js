import pool from "../config/db.js";

export const storeNewTenant = async (
  firstName,
  lastName,
  phoneNumber,
  hashedPassword,
) => {
  try {
    const result = await pool.query(
      `
            INSERT INTO tenant (first_name, last_name, phone_number, password_hash)
            VALUES ($1, $2, $3, $4) RETURNING tenant_id, username
            `,
      [firstName, lastName, phoneNumber, hashedPassword],
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error while storing new tenant:", error);
    throw error;
  }
};
