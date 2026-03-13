import { storeNewPost, getAllPost } from "../models/post.model.js";

export const uploadPost = async (req, res) => {
  const { content } = req.body;

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
      message:
        "Server error. A problem occured while trying to upload your post",
    });
  }
};

