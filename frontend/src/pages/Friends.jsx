import { useEffect, useState } from "react";
import API from "../services/api";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [userId, setUserId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("friends");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserId(user?._id);

    const fetchData = async () => {
      setLoading(true);
      try {
        const [friendsRes, requestsRes] = await Promise.all([
          API.get("/users/friends"),
          API.get("/users/requests")
        ]);
        setFriends(friendsRes.data);
        setRequests(requestsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const acceptRequest = async (id) => {
    await API.post(`/users/accept/${id}`);
    // Update UI without reload
    const requestToAccept = requests.find(r => r._id === id);
    setRequests(requests.filter(r => r._id !== id));
    setFriends([...friends, { ...requestToAccept, isNew: true }]);
  };

  const rejectRequest = async (id) => {
    await API.delete(`/users/reject/${id}`);
    setRequests(requests.filter(r => r._id !== id));
  };

  const removeFriend = async (id) => {
    await API.delete(`/users/remove/${id}`);
    setFriends(friends.filter(f => f._id !== id));
  };

  const filteredFriends = friends.filter(friend =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-b from-slate-950 to-slate-950/80 backdrop-blur-lg border-b border-slate-800/50 pt-6 pb-4 px-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-pink-400 bg-clip-text text-transparent">
                Friends
              </h1>
              <p className="text-slate-400 text-sm">Connect and stay authentic</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-slate-800/50 rounded-full transition">
                <span className="text-xl">➕</span>
              </button>
              <button className="p-2 hover:bg-slate-800/50 rounded-full transition">
                <span className="text-xl">📋</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <span className="text-slate-400">🔍</span>
            </div>
            <input
              type="text"
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent"
            />
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setActiveTab("friends")}
              className={`flex-1 py-2 rounded-xl font-medium transition ${activeTab === "friends" ? "bg-amber-500/20 text-amber-300" : "hover:bg-slate-800/50"}`}
            >
              Friends ({friends.length})
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`flex-1 py-2 rounded-xl font-medium transition relative ${activeTab === "requests" ? "bg-pink-500/20 text-pink-300" : "hover:bg-slate-800/50"}`}
            >
              Requests ({requests.length})
              {requests.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-xs rounded-full flex items-center justify-center">
                  {requests.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("suggestions")}
              className={`flex-1 py-2 rounded-xl font-medium transition ${activeTab === "suggestions" ? "bg-blue-500/20 text-blue-300" : "hover:bg-slate-800/50"}`}
            >
              Discover
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 pb-24">
        {loading ? (
          // Loading State
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-slate-700 border-t-amber-500 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-pink-500"></div>
              </div>
            </div>
            <p className="mt-4 text-slate-400">Loading your friends...</p>
          </div>
        ) : (
          <>
            {/* Friends Tab */}
            {activeTab === "friends" && (
              <div className="pt-4">
                {filteredFriends.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">👥</div>
                    <h3 className="text-xl font-bold mb-2">No friends yet</h3>
                    <p className="text-slate-400 mb-6">Start adding friends to see their BeReals!</p>
                    <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-pink-500 rounded-full font-semibold hover:opacity-90 transition">
                      Discover People
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Online Status */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {friends.slice(0, 3).map((friend, idx) => (
                            <div key={idx} className="w-8 h-8 rounded-full bg-gradient-to-r from-slate-700 to-slate-800 border-2 border-slate-900">
                              <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold">
                                {friend.username[0].toUpperCase()}
                              </div>
                            </div>
                          ))}
                        </div>
                        <span className="text-sm text-slate-400">
                          {friends.filter(f => f.isOnline).length} online now
                        </span>
                      </div>
                      <button className="text-sm text-amber-400 hover:text-amber-300 transition">
                        Sort by: Recent
                      </button>
                    </div>

                    {/* Friends List */}
                    <div className="space-y-3">
                      {filteredFriends.map((friend) => (
                        <div key={friend._id} className="group bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/30 hover:border-amber-500/30 transition">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-slate-700 to-slate-800 p-0.5">
                                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                                    <span className="text-lg font-bold">{friend.username[0].toUpperCase()}</span>
                                  </div>
                                </div>
                                {friend.isOnline && (
                                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
                                )}
                                {friend.isNew && (
                                  <div className="absolute -top-1 -left-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                                    <span className="text-[10px]">New</span>
                                  </div>
                                )}
                              </div>
                              <div>
                                <h3 className="font-bold text-lg">{friend.username}</h3>
                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                  <span>{friend.isOnline ? '🟢 Online' : '⚫ Last seen 2h ago'}</span>
                                  {friend.streak > 0 && (
                                    <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full">
                                      🔥 {friend.streak} day streak
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                              <button className="p-2 hover:bg-slate-700/50 rounded-lg transition">
                                <span className="text-xl">💬</span>
                              </button>
                              <button 
                                onClick={() => removeFriend(friend._id)}
                                className="p-2 hover:bg-red-500/20 rounded-lg transition text-red-400"
                              >
                                <span className="text-xl">✕</span>
                              </button>
                            </div>
                          </div>
                          {friend.lastPost && (
                            <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
                              <span className="text-amber-400">📸</span>
                              <span>Posted {friend.lastPost.time} • {friend.lastPost.location}</span>
                              <span className="text-pink-400">❤️ {friend.lastPost.likes}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Requests Tab */}
            {activeTab === "requests" && (
              <div className="pt-4">
                {requests.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📭</div>
                    <h3 className="text-xl font-bold mb-2">No pending requests</h3>
                    <p className="text-slate-400">When someone sends you a request, it'll appear here</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-bold">Pending Requests</h3>
                      <button className="text-sm text-slate-400 hover:text-white transition">
                        Clear All
                      </button>
                    </div>
                    <div className="space-y-3">
                      {requests.map((request) => (
                        <div key={request._id} className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/30">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-slate-700 to-slate-800 flex items-center justify-center">
                                <span className="text-lg font-bold">{request.username[0].toUpperCase()}</span>
                              </div>
                              <div>
                                <h3 className="font-bold">{request.username}</h3>
                                <p className="text-sm text-slate-400">Sent 2 hours ago</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs bg-slate-700/50 px-2 py-0.5 rounded-full">
                                    {request.mutualFriends} mutual friends
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() => acceptRequest(request._id)}
                              className="flex-1 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl font-semibold hover:opacity-90 transition"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => rejectRequest(request._id)}
                              className="flex-1 py-2 bg-slate-800 rounded-xl font-semibold border border-slate-700 hover:border-red-500/50 hover:bg-red-500/10 transition text-red-400"
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Suggestions Tab */}
            {activeTab === "suggestions" && (
              <div className="pt-4">
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-4">People You May Know</h3>
                  <div className="space-y-3">
                    {[
                      { name: "Alex Chen", mutual: 8, location: "New York" },
                      { name: "Sam Rivera", mutual: 5, location: "Los Angeles" },
                      { name: "Jordan Smith", mutual: 12, location: "Chicago" },
                      { name: "Taylor Kim", mutual: 3, location: "Miami" },
                    ].map((person, idx) => (
                      <div key={idx} className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-slate-700 to-slate-800 flex items-center justify-center">
                              <span className="text-lg font-bold">{person.name[0]}</span>
                            </div>
                            <div>
                              <h3 className="font-bold">{person.name}</h3>
                              <p className="text-sm text-slate-400">{person.mutual} mutual friends</p>
                              <p className="text-xs text-slate-500">{person.location}</p>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-pink-500 rounded-full text-sm font-semibold hover:opacity-90 transition">
                            Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Add */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-4">Quick Add from Contacts</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {["Emma", "Noah", "Olivia", "Liam"].map((name, idx) => (
                      <div key={idx} className="bg-slate-800/30 rounded-xl p-3 text-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-slate-700 to-slate-800 mx-auto mb-2 flex items-center justify-center">
                          <span className="text-lg">{name[0]}</span>
                        </div>
                        <div className="font-medium">{name}</div>
                        <button className="mt-2 w-full py-1.5 bg-slate-700/50 rounded-lg text-xs hover:bg-slate-600/50 transition">
                          Invite
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Friend Floating Button */}
      <button className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-pink-500 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
        <span className="text-2xl">➕</span>
      </button>
    </div>
  );
};

export default Friends;