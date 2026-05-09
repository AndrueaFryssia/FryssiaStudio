import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { supabase, signInWithGoogle } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

const MessageCard = ({ msg, onRead, onPin, onDelete }) => {
  const [showDelete, setShowDelete] = useState(false);
  const timeAgo = (dateStr) => {
    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60) return "baru saja";
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    return `${Math.floor(diff / 86400)} hari lalu`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`clay-card p-5 relative ${msg.is_pinned ? "bg-butter border-2 border-retro-red" : "bg-white"} ${!msg.is_read ? "border-l-4 border-l-retro-red" : ""}`}
    >
      {/* Pin badge */}
      {msg.is_pinned && (
        <span className="retro-tag bg-retro-red text-white text-[10px] absolute top-3 right-3">📌 Pinned</span>
      )}
      {!msg.is_read && (
        <span className="retro-tag bg-pink-sweets text-charcoal text-[10px] absolute top-3 right-3">NEW</span>
      )}

      {/* Avatar */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full border-2 border-charcoal bg-pink-light flex items-center justify-center text-xl flex-shrink-0">
          🕵️
        </div>
        <div className="flex-1">
          <p className="font-mono text-xs text-charcoal/50">
            Anonim {msg.sender_hint && `· clue: "${msg.sender_hint}"`}
          </p>
          <p className="font-mono text-[10px] text-charcoal/30">{timeAgo(msg.created_at)}</p>
        </div>
      </div>

      {/* Message */}
      <p className="font-body text-charcoal leading-relaxed text-sm mb-4">{msg.message}</p>

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        {!msg.is_read && (
          <button
            onClick={() => onRead(msg.id)}
            className="clay-btn text-xs py-1.5 px-3 bg-butter"
          >
            ✓ Tandai Dibaca
          </button>
        )}
        <button
          onClick={() => onPin(msg.id, !msg.is_pinned)}
          className="clay-btn text-xs py-1.5 px-3 bg-white"
        >
          {msg.is_pinned ? "📌 Unpin" : "📌 Pin"}
        </button>
        <button
          onClick={() => setShowDelete(true)}
          className="clay-btn text-xs py-1.5 px-3 bg-white text-retro-red ml-auto"
        >
          🗑️
        </button>
      </div>

      {/* Delete confirm */}
      <AnimatePresence>
        {showDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/95 rounded-clay flex items-center justify-center gap-3"
          >
            <p className="font-mono text-xs">Hapus pesan ini?</p>
            <button onClick={() => onDelete(msg.id)} className="clay-btn bg-retro-red text-white text-xs py-1.5 px-3">Ya</button>
            <button onClick={() => setShowDelete(false)} className="clay-btn bg-white text-xs py-1.5 px-3">Batal</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const NglInboxPage = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | unread | pinned
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) fetchMessages();
  }, [user]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("anonymous_messages")
        .select("*")
        .eq("recipient_id", user.id)
        .order("created_at", { ascending: false });
      if (!error) setMessages(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    await supabase.from("anonymous_messages").update({ is_read: true }).eq("id", id);
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, is_read: true } : m));
  };

  const togglePin = async (id, pinned) => {
    await supabase.from("anonymous_messages").update({ is_pinned: pinned }).eq("id", id);
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, is_pinned: pinned } : m));
  };

  const deleteMessage = async (id) => {
    await supabase.from("anonymous_messages").delete().eq("id", id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const nglLink = profile?.ngl_slug ? `${window.location.origin}/ngl/${profile.ngl_slug}` : "";

  const copyLink = () => {
    navigator.clipboard.writeText(nglLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredMessages = messages.filter((m) => {
    if (filter === "unread") return !m.is_read;
    if (filter === "pinned") return m.is_pinned;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.is_read).length;

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-butter">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity }} className="text-5xl">💌</motion.div>
    </div>
  );

  if (!user) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="clay-card bg-butter p-8 max-w-sm text-center">
          <div className="text-6xl mb-4">💌</div>
          <h2 className="font-retro text-3xl mb-3">NGL Inbox</h2>
          <p className="font-body text-charcoal/70 text-sm mb-6 leading-relaxed">
            Login untuk melihat pesan anonimmu dan mendapatkan link NGL-mu!
          </p>
          <button
            onClick={signInWithGoogle}
            className="clay-btn bg-retro-red text-white w-full py-4 text-lg"
          >
            🔑 Login dengan Google
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="retro-tag bg-pink-sweets text-charcoal mb-3 inline-block">💌 NGL Inbox</span>
          <div className="flex items-center gap-3">
            <img
              src={user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${user.email}`}
              alt="avatar"
              className="w-12 h-12 rounded-full border-3 border-charcoal shadow-clay-sm"
            />
            <div>
              <h1 className="font-retro text-3xl text-charcoal">{profile?.full_name?.split(" ")[0]}'s Inbox</h1>
              <p className="font-mono text-xs text-charcoal/50">
                {unreadCount > 0 ? `${unreadCount} pesan belum dibaca` : "Semua sudah dibaca ✓"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* NGL Link Share Card */}
        {nglLink && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="clay-card bg-butter p-5 mb-6"
          >
            <p className="font-mono text-xs font-bold mb-2">🔗 Link NGL-mu:</p>
            <div className="flex gap-2 items-center">
              <span className="font-mono text-xs text-charcoal/70 flex-1 truncate">{nglLink}</span>
              <button
                onClick={copyLink}
                className={`clay-btn text-xs py-2 px-4 flex-shrink-0 transition-all ${copied ? "bg-retro-red text-white" : "bg-white"}`}
              >
                {copied ? "✓ Copied!" : "Copy"}
              </button>
            </div>
            <p className="font-mono text-[10px] text-charcoal/40 mt-2">
              Bagikan link ini ke teman-temanmu untuk menerima pesan anonim!
            </p>
          </motion.div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: "all", label: `📬 Semua (${messages.length})` },
            { id: "unread", label: `🔴 Belum Dibaca (${unreadCount})` },
            { id: "pinned", label: `📌 Pinned` },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`clay-btn text-xs py-2 px-4 ${filter === f.id ? "bg-retro-red text-white" : "bg-white"}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Messages */}
        {loading ? (
          <div className="text-center py-12">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity }} className="text-5xl inline-block">💌</motion.div>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="clay-card bg-white p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="font-retro text-2xl text-charcoal mb-2">Inbox Kosong</h3>
            <p className="font-body text-sm text-charcoal/60 mb-4">
              {filter === "all"
                ? "Belum ada pesan anonim. Bagikan link NGL-mu!"
                : filter === "unread"
                ? "Semua pesan sudah dibaca 🎉"
                : "Belum ada pesan yang di-pin."}
            </p>
            {nglLink && filter === "all" && (
              <button onClick={copyLink} className="clay-btn bg-retro-red text-white px-6">
                Copy Link NGL
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredMessages.map((msg) => (
                <MessageCard
                  key={msg.id}
                  msg={msg}
                  onRead={markRead}
                  onPin={togglePin}
                  onDelete={deleteMessage}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
};

export default NglInboxPage;
