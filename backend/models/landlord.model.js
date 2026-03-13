import pool from "../config/db.config.js";

const getLandlordById = async (id) => {
  try {
    const result = await pool.query(
      `SELECT * FROM landlord WHERE landlord_id = $1`,
      [id],
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error in getLandlordById function:", error);
    throw error;
  }
};

export { getLandlordById };
