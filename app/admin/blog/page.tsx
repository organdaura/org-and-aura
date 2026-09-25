"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Calendar, Tag, RefreshCw, X, Loader2, Eye, EyeOff } from "lucide-react";

interface PostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  published: boolean;
  publishedAt: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [newPost, setNewPost] = useState({
    title: "",
    slug: "",
    category: "Industry Insights",
    excerpt: "",
    body: "",
  });

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog");
      const data = await res.json();
      if (data.success) setPosts(data.data);
    } catch (e) {
      console.error("Failed to load blog posts", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      const res = await fetch(`/api/admin/blog?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  const handleTogglePublish = async (post: PostItem) => {
    const nextState = !post.published;
    try {
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, published: nextState } : p))
      );

      const res = await fetch("/api/admin/blog", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: post.id, published: nextState }),
      });

      if (!res.ok) {
        fetchPosts();
      }
    } catch (e) {
      console.error("Toggle publish failed", e);
      fetchPosts();
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to publish article");
      }

      setPosts((prev) => [data.data, ...prev]);
      setModalOpen(false);
      setNewPost({
        title: "",
        slug: "",
        category: "Industry Insights",
        excerpt: "",
        body: "",
      });
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Error creating post");
    } finally {
      setSubmitting(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-forest-900">
            Editorial &amp; Insights Management
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-700">
            Publish research articles, pilot results, and engineering stories.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchPosts}
            disabled={loading}
            className="flex items-center gap-1 text-xs font-semibold text-forest-700 bg-white border border-cream-300 hover:bg-cream-50 px-3 py-1.5 rounded-lg shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold bg-forest-500 hover:bg-forest-600 text-white px-3.5 py-1.5 rounded-lg shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Article</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="card-organic p-12 text-center text-xs text-charcoal-600">
          Loading articles from PostgreSQL...
        </div>
      ) : posts.length === 0 ? (
        <div className="card-organic p-12 text-center text-xs text-charcoal-600">
          No articles published yet.
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="card-organic p-4 sm:p-5 bg-white flex items-start justify-between gap-4 text-left transition-shadow hover:shadow-organic"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-forest-700 bg-forest-50 border border-forest-200 px-2 py-0.5 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-charcoal-500 font-mono">/blog/{post.slug}</span>
                </div>
                <h2 className="text-sm sm:text-base font-bold text-charcoal-900">
                  {post.title}
                </h2>
                <p className="text-xs text-charcoal-600 line-clamp-2">{post.excerpt}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleTogglePublish(post)}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors ${
                    post.published
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                      : "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
                  }`}
                  title={post.published ? "Click to set as Draft" : "Click to publish live"}
                >
                  {post.published ? (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Published</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Draft</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(post.id)}
                  title="Delete article"
                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Post Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-organic p-6 sm:p-8 bg-white max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <h2 className="text-lg font-serif font-bold text-forest-900">
                Publish New Editorial Article
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-charcoal-500 hover:text-charcoal-800 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs">{errorMsg}</div>
            )}

            <form onSubmit={handleCreatePost} className="space-y-3.5 text-left text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-charcoal-800">Article Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next-Generation Bio-Degradation Cycles"
                  value={newPost.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setNewPost((prev) => ({
                      ...prev,
                      title,
                      slug: generateSlug(title),
                    }));
                  }}
                  className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-charcoal-800">URL Slug</label>
                <input
                  type="text"
                  required
                  value={newPost.slug}
                  onChange={(e) =>
                    setNewPost((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-cream-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-charcoal-800">Category</label>
                <select
                  value={newPost.category}
                  onChange={(e) =>
                    setNewPost((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                >
                  <option value="Industry Insights">Industry Insights</option>
                  <option value="Environmental Impact">Environmental Impact</option>
                  <option value="Design & Brand">Design &amp; Brand</option>
                  <option value="Tech Updates">Tech Updates</option>
                  <option value="Company Culture">Company Culture</option>
                  <option value="Deep Dive">Deep Dive</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-charcoal-800">Short Excerpt</label>
                <textarea
                  rows={2}
                  required
                  value={newPost.excerpt}
                  onChange={(e) =>
                    setNewPost((prev) => ({ ...prev, excerpt: e.target.value }))
                  }
                  placeholder="Brief 1-2 sentence overview shown in the grid..."
                  className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-charcoal-800">Full Article Content</label>
                <textarea
                  rows={6}
                  required
                  value={newPost.body}
                  onChange={(e) =>
                    setNewPost((prev) => ({ ...prev, body: e.target.value }))
                  }
                  placeholder="Write body paragraphs (supports ## headings)..."
                  className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-cream-300 rounded-full font-semibold text-charcoal-700 hover:bg-cream-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-forest-500 hover:bg-forest-600 disabled:bg-forest-300 text-white rounded-full font-semibold flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Publish Article</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
