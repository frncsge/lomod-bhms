import {
  insertPost,
  fetchPost,
  fetchPosts,
  fetchArchivedPostsByLandlordId,
  updatePost,
} from "../models/post.model.js";

export const getPost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await fetchPost(id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    // if archived, only the owner of the post can access it
    if (post.archived && post.landlord_id !== req.user.sub)
      return res.status(403).json({ message: "Post is archived" });

    res.status(200).json({ post });
  } catch (error) {
    console.error("Error when getting post:", error);
    res.status(500).json({
      message: "Server error. A problem occured while trying to get post",
    });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await fetchPosts();

    res.status(200).json({ message: "Posts successfully retrieved", posts });
  } catch (error) {
    console.error("Error when getting posts:", error);
    res.status(500).json({
      message: "Server error. A problem occured while trying to get posts",
    });
  }
};

export const createPost = async (req, res) => {
  const { content } = req.body;

  if (!content)
    return res.status(400).json({ message: "Content of a post is required" });

  try {
    await insertPost(req.user.sub, content);

    res.status(201).json({ message: "Post created successfully" });
  } catch (error) {
    console.error("Error when creating post:", error);
    res.status(500).json({
      message:
        "Server error. A problem occured while trying to create the post",
    });
  }
};

export const getLandlordArchivedPosts = async (req, res) => {
  try {
    const archivedPosts = await fetchArchivedPostsByLandlordId(req.user.sub);

    res.status(200).json({
      message: "Archived posts successfully retrieved",
      archivedPosts,
    });
  } catch (error) {
    console.error("Error when getting landlord archived posts:", error);
    res.status(500).json({
      message:
        "Server error. A problem occured while trying to get archived posts",
    });
  }
};

export const editPost = async (req, res) => {
  const { id } = req.params;
  const { text, archive } = req.body;

  try {
    // check if resource exists
    const post = await fetchPost(id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    // check ownership
    if (post.landlord_id !== req.user.sub) {
      return res.status(403).json({ message: "You cannot edit this post" });
    }

    // check if both text and archive are undefined
    if (text === undefined && archive === undefined)
      return res.status(400).json({
        message: "Nothing to edit",
      });

    // edit if not undefined
    if (text !== undefined) await updatePost.text(id, text);

    if (archive !== undefined) {
      if (typeof archive !== "boolean")
        return res.status(400).json({ message: "Archive must be a boolean" });

      await updatePost.archive(id, archive);
    }

    res.status(200).json({ message: "Post updated successfully", post_id: id });
  } catch (error) {
    console.error("Error when posting:", error);
    res.status(500).json({
      message: "Server error. A problem occured while trying to edit a post",
    });
  }
};

// to do:
// apply caching
