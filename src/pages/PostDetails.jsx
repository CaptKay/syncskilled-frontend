// src/pages/PostDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePosts } from "../context/PostContext";
import { useAuth } from "../auth/AuthContext";

const statusClass = (status) => {
  if (!status) return "status-active";
  const normalized = status.toLowerCase();
  if (normalized === "archived") return "status-archived";
  return "status-active";
};

export default function PostDetails() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { getSinglePost, getCommentsByPost, deletePost } = usePosts();
  const { user } = useAuth();

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
        const postData = await getSinglePost(postId);
        if (!postData) throw new Error("Post not found");
        setPost(postData);

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

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(postId);
        navigate("/posts");
      } catch (err) {
        setError(err.message || "Error deleting post");
      }
    }
  };

  if (loading) {
    return (
      <div className="section-card text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-fuchsia-200 border-t-fuchsia-500" />
        <h2 className="heading text-lg">Loading the exchange details…</h2>
        <p className="subtle">Hang tight while we prep this opportunity for you.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-card text-center">
        <h2 className="heading text-lg text-red-600">Something went wrong</h2>
        <p className="subtle">{error}</p>
        <button className="btn-outline mx-auto" onClick={() => navigate("/posts")}>
          Back to posts
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="section-card text-center">
        <div className="empty-title">Post not found</div>
        <p className="empty-copy">It may have been removed or never existed.</p>
        <button className="btn-outline mx-auto" onClick={() => navigate("/posts")}>
          Return to marketplace
        </button>
      </div>
    );
  }

  const isAuthor = user && post.author && user._id === post.author._id;
  const commentsCount = comments.length;
  const statusLabel = post.status
    ? `${post.status.charAt(0).toUpperCase()}${post.status.slice(1)}`
    : "Active";

  return (
    <div className="grid gap-8">
      <button className="btn-ghost justify-start w-fit" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <article className="section-card">
        <header className="grid gap-4">
          <span className="section-title">Exchange spotlight</span>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="heading text-3xl font-bold flex-1">{post.title}</h1>
            <span className={statusClass(post.status)}>{statusLabel}</span>
          </div>
          <p className="text-base text-slate-600 leading-relaxed">
            {post.description || "No description provided."}
          </p>
        </header>

        <div className="grid gap-4">
          <div className="meta-grid">
            <div className="meta-item">
              <div className="meta-label">Created by</div>
              <div className="meta-value">{post.author?.username || "Unknown"}</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">Wants to learn</div>
              <div className="meta-value">{post.skillToLearn?.name || "—"}</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">Can teach</div>
              <div className="meta-value">{post.skillToTeach?.name || "—"}</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">Exchange credits</div>
              <div className="meta-value">{post.exchangeCredits ?? 0}</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">Status</div>
              <div className="meta-value">{post.status || "active"}</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">Location</div>
              <div className="meta-value">{post.location || "Remote"}</div>
            </div>
          </div>

          <div className="surface-soft p-6 rounded-2xl grid gap-2">
            <div className="text-xs uppercase tracking-[0.25em] text-slate-500">Comments</div>
            <div className="text-lg font-semibold text-slate-900">{commentsCount} total</div>
            <div className="comment-list">
              {commentsCount === 0 ? (
                <p className="subtle">No comments yet. Be the first to share your thoughts.</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="comment-card">
                    <div className="text-xs uppercase tracking-[0.25em] text-slate-500">
                      {comment.author?.username || "Anonymous"}
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {comment.comment || "—"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {isAuthor && (
          <div className="form-actions">
            <button
              className="btn-outline"
              onClick={() => navigate(`/posts/${postId}/edit`)}
            >
              Edit post
            </button>
            <button className="btn-muted text-red-600 border-red-200 hover:border-red-300" onClick={handleDelete}>
              Delete post
            </button>
          </div>
        )}
      </article>
    </div>
  );
}
