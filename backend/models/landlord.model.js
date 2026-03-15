import pool from "../config/db.config.js";

export const getLandlordByUserId = async (id) => {
  try {
    const result = await pool.query(
      `SELECT * FROM landlord WHERE user_id = $1`,
      [id],
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error in getLandlordByUserId function:", error);
    throw error;
  }
};
