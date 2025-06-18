import { useEffect, useState } from "react";
import { useAuth } from "../auth";
import permissions from "../roles/permissions";
import api from "../services/api";
import { Navigate } from "react-router-dom";

const PageTemplate = ({ fileKey, title }) => {
  const { user, loading } = useAuth();
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!loading && user) {
      api
        .get(`/api/text-file?name=${fileKey}`)
        .then((res) => setContent(res.data.content))
        .catch((err) => {
          setContent("");
          setMsg(err.response?.data?.error || "Failed to load content.");
        });
    }
  }, [loading, user, fileKey]);

  if (loading) return <div className="p-4 text-white">Loading...</div>;
  if (!user) return <Navigate to="/" />;

  const perm = permissions[user.role]?.[title] || "NA";
  if (perm === "NA") return <Navigate to="/unauthorized" />;
  const readOnly = perm === "R";

  const handleSave = () => {
    setSaving(true);
    api
      .post("/api/text-file", { name: fileKey, content })
      .then((res) => setMsg(res.data.message || "Saved."))
      .catch((err) => setMsg(err.response?.data?.error || "Save failed."))
      .finally(() => setSaving(false));
  };

  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => setMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 p-4">
      <div className="w-full max-w-2xl bg-[#16181c] rounded-2xl shadow-2xl p-8 border border-gray-800">
        <h2 className="text-3xl font-bold mb-7 text-white">{title}</h2>
        <textarea
          className="w-full h-64 bg-[#23272f] text-gray-100 border border-gray-700 p-3 rounded-xl mb-4 focus:outline-none focus:border-blue-500 transition"
          value={content}
          readOnly={readOnly}
          onChange={(e) => setContent(e.target.value)}
        />
        {perm === "R/W" && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-green-400 text-white font-semibold text-lg shadow-lg hover:scale-105 active:scale-95 transition"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        )}
        {msg && <p className="mt-4 text-green-400 text-center">{msg}</p>}
      </div>
    </div>
  );
};

export default PageTemplate;
