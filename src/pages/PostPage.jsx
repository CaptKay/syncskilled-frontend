import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usePosts } from "../context/PostContext";
import { useAuth } from "../auth/AuthContext";

const statusClass = (status) => {
  if (!status) return "status-active";
  const normalized = status.toLowerCase();
  if (normalized === "archived") return "status-archived";
  return "status-active";
};

export default function PostPage() {
  const { posts, loading, error, getAllPosts } = usePosts();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getAllPosts();
  }, [getAllPosts]);

  if (loading) {
    return (
      <div className="section-card text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-fuchsia-200 border-t-fuchsia-500" />
        <h2 className="heading text-lg">Fetching the latest swaps…</h2>
        <p className="subtle">Give us a quick moment while we sync the community board.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-card text-center">
        <h2 className="heading text-lg text-red-600">We couldn’t load posts</h2>
        <p className="subtle">{error}</p>
        <button className="btn-outline mx-auto" onClick={() => getAllPosts()}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      <header className="post-header">
        <div className="grid gap-2">
          <span className="section-title">Community marketplace</span>
          <h1 className="heading text-3xl font-bold">Discover exchanges posted by peers</h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Browse active swaps and find a match that aligns with the skills you’re eager to learn or
            teach. Each post highlights the exchange credits involved so collaborations feel
            effortless and fair.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {user ? (
            <button className="btn-primary" onClick={() => navigate("/posts/create")}>Create post</button>
          ) : (
            <Link className="btn-outline" to="/register">
              Join SyncSkilled
            </Link>
          )}
        </div>
      </header>

      {posts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-title">No posts just yet</div>
          <p className="empty-copy">
            Be the first to share a skill exchange opportunity and help the community grow.
          </p>
          {user ? (
            <button className="btn-primary mx-auto" onClick={() => navigate("/posts/create")}>
              Launch your first post
            </button>
          ) : (
            <Link className="btn-outline mx-auto" to="/register">
              Create an account
            </Link>
          )}
        </div>
      ) : (
        <div className="post-grid">
          {posts.map((post) => {
            const commentsCount = Array.isArray(post.comments) ? post.comments.length : 0;
            const authorInitials = (post.author?.username || "?").slice(0, 2).toUpperCase();
            const statusLabel = post.status
              ? `${post.status.charAt(0).toUpperCase()}${post.status.slice(1)}`
              : "Active";
            return (
              <article
                key={post._id}
                className="post-card"
                onClick={() => navigate(`/posts/${post._id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(`/posts/${post._id}`);
                  }
                }}
              >
                <div className="post-header">
                  <div className="flex items-center gap-3">
                    <div className="avatar-ring">
                      {post.author?.profilePhoto ? (
                        <img src={post.author.profilePhoto} alt={post.author?.username || "Author"} />
                      ) : (
                        <div className="avatar">{authorInitials}</div>
                      )}
                    </div>
                    <div className="grid gap-1">
                      <h2 className="post-title">{post.title}</h2>
                      <span className="text-xs text-slate-500 uppercase tracking-[0.25em]">
                        {post.author?.username || "Unknown"}
                      </span>
                    </div>
                  </div>
                  <span className={statusClass(post.status)}>{statusLabel}</span>
                </div>

                <p className="post-preview">{post.description || "No description provided."}</p>

                <div className="meta-grid">
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
                    <div className="meta-label">Comments</div>
                    <div className="meta-value">{commentsCount}</div>
                  </div>
                </div>

                <div className="post-footer">
                  <span className="subtle">
                    {post.location ? `📍 ${post.location}` : "🌐 Remote-friendly"}
                  </span>
                  <span className="badge-soft">Tap to view details →</span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
