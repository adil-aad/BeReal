import API from "../services/api";
import { useState } from "react";

const PostCard = ({ post }) => {
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [reactionCount, setReactionCount] = useState(24); // Example count
  const [commentCount, setCommentCount] = useState(8); // Example count

  const react = (emoji) => {
    API.post(`/posts/${post._id}/react`, { emoji });
    setIsLiked(true);
    setReactionCount(prev => prev + 1);
  };

  const submitComment = () => {
    if (comment.trim()) {
      // API call for comment
      setComment("");
      setCommentCount(prev => prev + 1); //optimistic ui
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 mb-8 transform transition-transform hover:scale-[1.01]">
      
      {/* Header with User Info */}
      <div className="p-5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-pink-500 p-0.5">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-lg">
                {post.user.username[0].toUpperCase()}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg tracking-tight">{post.user.username}</h3>
              <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full">Realmoji</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>2 min late</span>
              <span className="text-slate-600">•</span>
              <span>📍 New York</span>
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-slate-800 rounded-full transition">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {/* Dual Image Container */}
      <div className="relative aspect-[9/16] bg-gradient-to-br from-slate-800 to-slate-900">
        {/* Main Back Image */}
        <div className="absolute inset-0">
          <img
            src={`http://localhost:5000/${post.backImage}`}
            className="w-full h-full object-cover"
            alt="Back camera"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
        </div>

        {/* Front Image PIP */}
        <div className="absolute top-5 left-5 z-20">
          <div className="relative group">
            <div className="w-28 h-36 rounded-2xl overflow-hidden border-3 border-white shadow-2xl transform transition-transform group-hover:scale-105">
              <img
                src={`http://localhost:5000/${post.frontImage}`}
                className="w-full h-full object-cover"
                alt="Front camera"
              />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
              <div className="w-5 h-5 bg-slate-900 rounded-full"></div>
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white text-slate-900 text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">
              📸 Front Cam
            </div>
          </div>
        </div>

        {/* Interaction Overlay */}
        <div className="absolute bottom-5 right-5 flex flex-col gap-3">
          {[
            { emoji: "🔥", count: 12 },
            { emoji: "😍", count: 8 },
            { emoji: "😂", count: 5 }
          ].map((reaction, idx) => (
            <button
              key={idx}
              onClick={() => react(reaction.emoji)}
              className="w-12 h-12 bg-slate-900/80 backdrop-blur-sm rounded-full flex flex-col items-center justify-center hover:bg-slate-800/90 transition-all hover:scale-110"
            >
              <span className="text-xl">{reaction.emoji}</span>
              <span className="text-xs mt-0.5">{reaction.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Caption & Actions */}
      <div className="p-5">
        {/* Reaction Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 border-2 border-slate-900"></div>
                ))}
              </div>
              <span className="text-sm text-slate-400">
                {reactionCount} reactions
              </span>
            </div>
            <span className="text-slate-600">•</span>
            <div className="text-sm text-slate-400">
              {commentCount} comments
            </div>
          </div>
          <div className="text-xs text-slate-500">
            3 hours ago
          </div>
        </div>

        {/* Caption */}
        <p className="text-lg mb-6 leading-relaxed">
          <span className="font-bold mr-2">{post.user.username}</span>
          {post.caption}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => react("❤️")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${isLiked ? 'bg-pink-500/20 text-pink-400' : 'bg-slate-800 hover:bg-slate-700'}`}
          >
            <span className="text-xl">{isLiked ? "❤️" : "🤍"}</span>
            <span>React</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 transition">
            <span className="text-xl">💬</span>
            <span>Comment</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 transition">
            <span className="text-xl">↪️</span>
            <span>Share</span>
          </button>
        </div>

        {/* Comment Input */}
        <div className="flex items-center gap-3 border-t border-slate-800 pt-4">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
            <span className="font-bold">Y</span>
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && submitComment()}
              placeholder="Add your comment..."
              className="w-full bg-slate-800 rounded-full px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-500/50 transition"
            />
            {comment && (
              <button
                onClick={submitComment}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-amber-500 to-pink-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:opacity-90 transition"
              >
                Post
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;