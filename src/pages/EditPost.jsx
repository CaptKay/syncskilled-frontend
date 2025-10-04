// src/pages/EditPost.jsx
import { useState, useEffect } from "react";
import { usePosts } from "../context/PostContext";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function EditPost() {
  const { postId } = useParams();
  const { getSinglePost, updatePost } = usePosts();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skillToLearn, setSkillToLearn] = useState("");
  const [skillToTeach, setSkillToTeach] = useState("");
  const [exchangeCredits, setExchangeCredits] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the post data on mount
  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      setError(null);
      try {
        const postData = await getSinglePost(postId);
        if (!postData) throw new Error("Post not found");
        setPost(postData);

        // If the user is not the author, redirect away
        if (user._id !== postData.author?._id) {
          throw new Error("You are not authorized to edit this post.");
        }

        // Pre-fill the form fields with existing data
        setTitle(postData.title || "");
        setDescription(postData.description || "");
        setSkillToLearn(postData.skillToLearn?.name || "");
        setSkillToTeach(postData.skillToTeach?.name || "");
        setExchangeCredits(postData.exchangeCredits ?? 1);
      } catch (err) {
        setError(err.message || "Error loading post");
      } finally {
        setLoading(false);
      }
    }

    if (postId) {
      fetchPost();
    }
  }, [postId, getSinglePost, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await updatePost(postId, {
        title,
        description,
        skillToLearn,
        skillToTeach,
        exchangeCredits,
      });
      // After update, navigate to the post details page
      navigate(`/posts/${postId}`);
    } catch (err) {
      setError(err.message || "Error updating post");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading post data...</p>;
  if (error)   return <p style={{ color: "red" }}>{error}</p>;
  if (!post)   return <p>Post not found.</p>;

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: "600px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
      }}
    >
      <h2>Edit Post</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="text"
        placeholder="Skill to Learn"
        value={skillToLearn}
        onChange={(e) => setSkillToLearn(e.target.value)}
        required
      />
      
      <input
        type="text"
        placeholder="Skill to Teach"
        value={skillToTeach}
        onChange={(e) => setSkillToTeach(e.target.value)}
        required
      />
      
      <input
        type="number"
        placeholder="Exchange Credits"
        value={exchangeCredits}
        min={1}
        max={9999}
        onChange={(e) => setExchangeCredits(Number(e.target.value))}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Post"}
      </button>
    </form>
  );
}
