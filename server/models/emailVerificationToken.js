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

export { storeEmailVerificationToken };
