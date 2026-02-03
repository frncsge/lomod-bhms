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

const storeNewLandlord = async (email, hashed_password, accountName) => {
  try {
    const result = await pool.query(
      `INSERT INTO landlord (email, password_hash, account_name) 
      VALUES ($1, $2, $3)
      RETURNING landlord_id`,
      [email, hashed_password, accountName],
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error in storeNewLandlord function:", error);
    throw error;
  }
};

export { getLandlordByEmail, storeNewLandlord, getLandlordById };
