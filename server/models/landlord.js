import pool from "../config/db.js";

//for fetching the landlord using their email
async function getLandlordByEmail(email) {
  try {
    const result = await pool.query("SELECT * FROM landlord WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Error in getLandlordByEmail function:", error);
    throw error;
  }
}

export { getLandlordByEmail };
