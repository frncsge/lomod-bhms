import pool from "../config/db.config.js";

export const getUserByIdentifier = (identifier) => {
  try {
    const result = pool.query(
      "SELECT * FROM users WHERE email = $1 OR username = $1",
      [identifier],
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error in getting user by identifier:", error);
    throw error;
  }
};

export async function getUserByEmail(email) {
  try {
    const result = await pool.query("SELECT * FROM user WHERE email = $1", [
      email,
    ]);

    return result.rows[0];
  } catch (error) {
    console.error("Error in user by email function:", error);
    throw error;
  }
}
