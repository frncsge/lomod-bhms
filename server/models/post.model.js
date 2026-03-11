import pool from "../config/db.config.js";

export const storeNewPost = async (id, content) => {
  try {
    await pool.query(
      "INSERT INTO post (landlord_id, post_content) VALUES ($1, $2)",
      [id, content],
    );
  } catch (error) {
    console.error("Error in storeNewPost function", error);
    throw error;
  }
};
