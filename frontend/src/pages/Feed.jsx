import { useEffect, useState } from "react";
import API from "../services/api";
import PostCard from "../components/PostCard";
import Navbar from "../components/Navbar";
import Layout from "../components/Layout";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

//   const mockPosts = [
//     {
//       _id: "1",
//       user: {
//         _id: "1",
//         username: "AlexChen",
//         avatar: "A"
//       },
//       caption: "Morning coffee with the crew ☕️ Just posted 2 min late but worth it for this view!",
//       backImage: "./public/images/img1",    // ← Images from public folder
//       frontImage: "/images/coffee-front.jpg",  // ← Images from public folder
//       likes: 24,
//       comments: 8,
//       createdAt: new Date().toISOString(),
//       location: "Downtown Cafe",
//       isLate: true,
//       lateBy: "2 min"
//     },
//     {
//       _id: "2",
//       user: {
//         _id: "2",
//         username: "SamRivers",
//         avatar: "S"
//       },
//       caption: "Caught me at the perfect moment during my workout! 💪 No filter, just real.",
//       backImage: "/images/workout-back.jpg",
//       frontImage: "/images/workout-front.jpg",
//       likes: 42,
//       comments: 12,
//       createdAt: new Date().toISOString(),
//       location: "Gym",
//       isLate: false,
//       lateBy: "On time"
//     },
//     {
//       _id: "3",
//       user: {
//         _id: "3",
//         username: "JordanLee",
//         avatar: "J"
//       },
//       caption: "Late night coding session turned into a BeReal moment. Who else is up? 👨‍💻",
//       backImage: "/images/coding-back.jpg",
//       frontImage: "/images/coding-front.jpg",
//       likes: 31,
//       comments: 5,
//       createdAt: new Date().toISOString(),
//       location: "Home Office",
//       isLate: true,
//       lateBy: "5 min"
//     },
//     {
//       _id: "4",
//       user: {
//         _id: "4",
//         username: "TaylorSwift",
//         avatar: "T"
//       },
//       caption: "Backstage before the show! Can you guess the surprise song? 🎤✨",
//       backImage: "/images/concert-back.jpg",
//       frontImage: "/images/concert-front.jpg",
//       likes: 128,
//       comments: 42,
//       createdAt: new Date().toISOString(),
//       location: "Concert Venue",
//       isLate: false,
//       lateBy: "On time"
//     },
//     {
//       _id: "5",
//       user: {
//         _id: "5",
//         username: "MikeRoss",
//         avatar: "M"
//       },
//       caption: "Working from the park today. This beats the office any day! 🌳💼",
//       backImage: "/images/park-back.jpg",
//       frontImage: "/images/park-front.jpg",
//       likes: 18,
//       comments: 3,
//       createdAt: new Date().toISOString(),
//       location: "Central Park",
//       isLate: true,
//       lateBy: "3 min"
//     }
//   ];

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        // Try to fetch real posts from your API
        const res = await API.get("/posts");
        if (res.data && res.data.length > 0) {
          // If your API returns image paths like "uploads/filename.jpg"
          const postsWithCorrectedPaths = res.data.map(post => ({
            ...post,
            backImage: `http://localhost:5000/${post.backImage}`,
            frontImage: `http://localhost:5000/${post.frontImage}`
          }));
          setPosts(postsWithCorrectedPaths);
        } else {
          // Use mock data with local images
          setPosts(mockPosts);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        // Fallback to mock data
        setPosts(mockPosts);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filters = [
    { id: "all", label: "All" },
    { id: "today", label: "Today" },
    { id: "late", label: "Late" },
    { id: "trending", label: "Trending" }
  ];

  const filteredPosts = posts.filter(post => {
    if (activeFilter === "late") return post.isLate;
    if (activeFilter === "today") return true; // Add date filtering logic here
    return true;
  });

  return (
    <Layout>
      {/* Simple Header */}
      <div className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-lg border-b border-slate-800/50 pt-6 pb-4">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-pink-500"></div>
              <h1 className="text-xl font-bold">BeReal</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 hover:bg-slate-800/50 rounded-full transition">
                <span className="text-xl">🔔</span>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-slate-800/50 rounded-full transition">
                <span className="text-xl">🔍</span>
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm transition ${activeFilter === filter.id ? 'bg-gradient-to-r from-amber-500 to-pink-500 text-white' : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'}`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable Posts */}
      <div className="px-4 pb-32 pt-4">
        {loading ? (
          // Loading Skeletons
          <div className="space-y-6">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="bg-slate-800/30 rounded-2xl p-4 border border-slate-700/30 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-slate-700"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-700 rounded w-24"></div>
                    <div className="h-3 bg-slate-700 rounded w-16"></div>
                  </div>
                </div>
                <div className="aspect-[3/4] bg-slate-700 rounded-xl mb-4"></div>
                <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          // Empty State
          <div className="text-center py-20">
            <div className="text-6xl mb-6">📭</div>
            <h3 className="text-2xl font-bold mb-3">No posts yet</h3>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">
              Be the first to post! Capture your authentic moment and share it with friends.
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-amber-500 to-pink-500 rounded-full font-semibold hover:opacity-90 transition">
              📸 Post Your BeReal
            </button>
          </div>
        ) : (
          // Posts Feed
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}

        {/* End of Feed */}
        {!loading && filteredPosts.length > 0 && (
          <div className="text-center mt-8 pt-8 border-t border-slate-800/30">
            <div className="text-slate-500 text-sm mb-2">You're all caught up! 🎉</div>
            <div className="text-slate-600 text-xs">
              {filteredPosts.length} posts
            </div>
          </div>
        )}
      </div>

      <Navbar />
    </Layout>
  );
};

export default Feed;