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

export const getPost = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM post WHERE post_id = $1", [
      id,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Error in getPost function", error);
    throw error;
  }
};

export const updatePost = {
  text: async (id, newText) => {
    try {
      await pool.query("UPDATE post SET post_content = $1 WHERE post_id = $2", [
        newText,
        id,
      ]);
    } catch (error) {
      console.error("Error in updatePost.text function", error);
      throw error;
    }
  },

  archive: async (id, archived) => {
    try {
      await pool.query("UPDATE post SET archive = $1 WHERE post_id = $2", [
        archived,
        id,
      ]);
    } catch (error) {
      console.error("Error in updatePost.archive function", error);
      throw error;
    }
  },
};
