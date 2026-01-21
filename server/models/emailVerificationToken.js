import pool from "../config/db.js";

//storing landlord email verification tokens
async function storeEmailVerificationToken(token, expiresAt) {
  try {
    await pool.query(
      "INSERT INTO email_verification_token (verification_token, expires_at) VALUES ($1, $2)",
      [token, expiresAt],
    );
  } catch (error) {
    console.error(
      "Error in storeLandlordEmailVerificationToken function:",
      error,
    );
    throw error;
  }
}

const validateEmailVerificationToken = async (token) => {
  try {
    const result = await pool.query(
      `SELECT verification_token 
      FROM email_verification_token 
      WHERE verification_token = $1 
        AND expires_at > NOW() 
        AND is_used = FALSE`,
      [token],
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error in validateEmailVerificationToken function:", error);
    throw error;
  }
};

export { storeEmailVerificationToken, validateEmailVerificationToken };
