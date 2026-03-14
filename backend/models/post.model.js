import pool from "../config/db.config.js";

export const insertPost = async (landlord_id, content) => {
  try {
    await pool.query(
      "INSERT INTO post (landlord_id, post_content) VALUES ($1, $2)",
      [landlord_id, content],
    );
  } catch (error) {
    console.error("Error in insertPost function", error);
    throw error;
  }
};

export const fetchPost = async (postId) => {
  try {
    const result = await pool.query("SELECT * FROM post WHERE post_id = $1", [
      postId,
    ]);

    return result.rows[0];
  } catch (error) {
    console.error("Error in fetchPost function", error);
    throw error;
  }
};

export const fetchPosts = async () => {
  try {
    const result = await pool.query(
      "SELECT * FROM post WHERE archived = false ORDER BY created_at DESC",
    );

    return result.rows;
  } catch (error) {
    console.error("Error in fetchPosts function", error);
    throw error;
  }
};

export const fetchPostsByLandlordId = async (id) => {
  try {
    const result = await pool.query(
      "SELECT * FROM post WHERE archived = false AND landlord_id = $1",
      [id],
    );

    return result.rows;
  } catch (error) {
    console.error("Error in fetchPostsByLandlordId function", error);
    throw error;
  }
};

export const updatePost = {
  text: async (postId, newText) => {
    try {
      await pool.query("UPDATE post SET post_content = $1 WHERE post_id = $2", [
        newText,
        postId,
      ]);
    } catch (error) {
      console.error("Error in updatePost.text function", error);
      throw error;
    }
  },

  archive: async (postId, archived) => {
    try {
      await pool.query("UPDATE post SET archived = $1 WHERE post_id = $2", [
        archived,
        postId,
      ]);
    } catch (error) {
      console.error("Error in updatePost.archive function", error);
      throw error;
    }
  },
};
