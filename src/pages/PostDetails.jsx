// src/pages/PostDetails.jsx
import { useEffect, useState } from "react";
import { usePosts } from "../context/PostContext";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function PostDetails() {
  const { postId } = useParams();
  const { getSinglePost, getCommentsByPost, deletePost } = usePosts();
  const { user } = useAuth(); // access current user
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!postId) {
      setError("No postId in URL");
      setLoading(false);
      return;
    }

    async function fetchPost() {
      setLoading(true);
      setError(null);
      try {
        // Fetch the post
        const postData = await getSinglePost(postId);
        if (!postData) throw new Error("Post not found");
        setPost(postData);

        // Fetch comments
        const postComments = await getCommentsByPost(postId);
        setComments(Array.isArray(postComments) ? postComments : []);
      } catch (err) {
        setError(err.message || "Error loading post");
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [postId, getSinglePost, getCommentsByPost]);

  if (loading) return <p>Loading post...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!post) return <p>Post not found</p>;

  // Handler for deleting the post
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(postId);
        // After deletion, redirect to the list of all posts
        navigate("/posts");
      } catch (err) {
        setError(err.message || "Error deleting post");
      }
    }
  };

  // Check if current user is the author of this post
  const isAuthor = user && post.author && user._id === post.author._id;

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
      }}
    >
      <h2>{post.title}</h2>
      <p>
        <strong>Author:</strong> {post.author?.username || "Unknown"}
      </p>
      <p>{post.description || "No description provided."}</p>
      <p>
        <strong>Skill To Learn:</strong> {post.skillToLearn?.name || "-"}
      </p>
      <p>
        <strong>Skill To Teach:</strong> {post.skillToTeach?.name || "-"}
      </p>
      <p>
        <strong>Exchange Credits:</strong> {post.exchangeCredits ?? 0}
      </p>
      <p>
        <strong>Status:</strong> {post.status || "active"}
      </p>
      <p>
        <strong>Location:</strong> {post.location || "-"}
      </p>

      <h3>Comments ({comments.length})</h3>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul>
          {comments.map((c) => (
            <li key={c._id} style={{ marginBottom: "10px" }}>
              <strong>{c.author?.username || "Unknown"}:</strong>{" "}
              {c.comment || "-"}
            </li>
          ))}
        </ul>
      )}

      {/* Render Edit and Delete buttons only if the current user is the author */}
      {isAuthor && (
        <div style={{ marginTop: "20px" }}>
          <button
            onClick={() => navigate(`/posts/${postId}/edit`)}
            style={{
              marginRight: "10px",
              padding: "8px 16px",
              cursor: "pointer",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Edit Post
          </button>
          <button
            onClick={handleDelete}
            style={{
              padding: "8px 16px",
              cursor: "pointer",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Delete Post
          </button>
        </div>
      )}
    </div>
  );
}
