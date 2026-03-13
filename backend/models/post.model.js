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

export const getAllPost = async () => {
  try {
    const result = await pool.query("SELECT * FROM post");
    return result.rows;
  } catch (error) {
    console.error("Error in getAllPost function", error);
    throw error;
  }
};
