import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePosts } from "../context/PostContext";

export default function CreatePost({ onCreated }) {
  const { createPost } = usePosts();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skillToLearn, setSkillToLearn] = useState("");
  const [skillToTeach, setSkillToTeach] = useState("");
  const [exchangeCredits, setExchangeCredits] = useState(1);
  const [location, setLocation] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const newPost = await createPost({
        title,
        description,
        skillToLearn,
        skillToTeach,
        exchangeCredits,
        location,
      });
      onCreated?.(newPost);
      const targetId = newPost?._id;
      if (targetId) {
        navigate(`/posts/${targetId}`);
      } else {
        navigate("/posts");
      }
    } catch (err) {
      setError(err.message || "Error creating post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <button className="btn-ghost justify-start w-fit" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <section className="section-card">
        <header className="grid gap-2">
          <span className="section-title">Share a new exchange</span>
          <h1 className="heading text-3xl font-bold">Craft a post that invites collaboration</h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Highlight what you’d love to learn, what you can teach in return, and any context that helps
            the community understand your goals.
          </p>
        </header>

        <form className="form" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <div className="field-row">
            <label htmlFor="title" className="label">
              Post title
            </label>
            <input
              id="title"
              type="text"
              className="input"
              placeholder="e.g. Swap Figma tips for React mentorship"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="field-row">
            <label htmlFor="description" className="label">
              Description
            </label>
            <textarea
              id="description"
              className="textarea"
              placeholder="Share what you’re aiming to learn, your availability, and how you love to collaborate."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="field-row">
              <label htmlFor="skillToLearn" className="label">
                Skill to learn
              </label>
              <input
                id="skillToLearn"
                type="text"
                className="input"
                placeholder="Product storytelling"
                value={skillToLearn}
                onChange={(e) => setSkillToLearn(e.target.value)}
                required
              />
            </div>
            <div className="field-row">
              <label htmlFor="skillToTeach" className="label">
                Skill to teach
              </label>
              <input
                id="skillToTeach"
                type="text"
                className="input"
                placeholder="Advanced user research"
                value={skillToTeach}
                onChange={(e) => setSkillToTeach(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="field-row">
              <label htmlFor="exchangeCredits" className="label">
                Exchange credits
              </label>
              <input
                id="exchangeCredits"
                type="number"
                min={1}
                max={9999}
                className="input"
                value={exchangeCredits}
                onChange={(e) => setExchangeCredits(Number(e.target.value))}
                required
              />
            </div>
            <div className="field-row">
              <label htmlFor="location" className="label">
                Location
              </label>
              <input
                id="location"
                type="text"
                className="input"
                placeholder="Remote or city / timezone"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-muted"
              onClick={() => navigate("/posts")}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Publishing…" : "Publish post"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
