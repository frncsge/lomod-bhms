import {
  storeNewPost,
  getAllPost,
  getPost,
  updatePost,
} from "../models/post.model.js";

export const uploadPost = async (req, res) => {
  const { content } = req.body;

  // check if content/text of post is provided
  if (!content)
    return res.status(400).json({ message: "Content of a post is required" });

  try {
    await storeNewPost(req.user.sub, content);

    res.status(201).json({ message: "Post uploaded successfully" });
  } catch (error) {
    console.error("Error when posting:", error);
    res.status(500).json({
      message:
        "Server error. A problem occured while trying to upload your post",
    });
  }
};

export const sendAllPost = async (req, res) => {
  try {
    const posts = await getAllPost();

    res.status(200).json({ message: "Posts successfully retrieved", posts });
  } catch (error) {
    console.error("Error when posting:", error);
    res.status(500).json({
      message: "Server error. A problem occured while trying to send all post",
    });
  }
};

export const editPost = async (req, res) => {
  const { id } = req.params;
  const { text, archive } = req.body;

  try {
    // check if resource exists
    const post = await getPost(id);

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
// getAllPost should not include those that are archived
// apply caching
