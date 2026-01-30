import { useState } from 'react';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState("Sharing authentic moments daily.");

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 pt-8 pb-12 px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-pink-400 bg-clip-text text-transparent">
              Profile
            </h1>
            <button className="p-2 hover:bg-slate-800 rounded-full transition">
              <span className="text-xl">⚙️</span>
            </button>
          </div>

          {/* Profile Card */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-3xl p-6 border border-slate-800 shadow-2xl">
            {/* Avatar */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-500 to-pink-500 p-1">
                  <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-3xl font-bold">
                    {user.username[0].toUpperCase()}
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{user.username}</h2>
                <p className="text-slate-400">@{user.username.toLowerCase()}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded-full">🔥 28 streak</span>
                  <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">👑 Pro</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-400">BIO</h3>
                <button 
                  onClick={() => setIsEditingBio(!isEditingBio)}
                  className="text-xs text-amber-400 hover:text-amber-300 transition"
                >
                  {isEditingBio ? 'Save' : 'Edit'}
                </button>
              </div>
              {isEditingBio ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-slate-800 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
                  rows="2"
                />
              ) : (
                <p className="text-slate-300">{bio}</p>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[
                { label: 'Posts', value: '142' },
                { label: 'Friends', value: '86' },
                { label: 'Streak', value: '28' },
                { label: 'Likes', value: '1.2k' },
              ].map((stat, idx) => (
                <div key={idx} className="text-center p-2 bg-slate-800/50 rounded-xl">
                  <div className="text-xl font-bold">{stat.value}</div>
                  <div className="text-xs text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Account Info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                    <span className="text-sm">📧</span>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Email</div>
                    <div className="font-medium">{user.email}</div>
                  </div>
                </div>
                <span className="text-xs text-emerald-400">Verified</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                    <span className="text-sm">📱</span>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Member Since</div>
                    <div className="font-medium">January 2024</div>
                  </div>
                </div>
                <span className="text-xs text-slate-400">8 months</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="max-w-md mx-auto px-4 mt-6 space-y-3 pb-20">
        <button className="w-full py-3 bg-gradient-to-r from-amber-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition">
          ✏️ Edit Profile
        </button>
        <button className="w-full py-3 bg-slate-900 rounded-xl font-semibold border border-slate-800 hover:border-slate-700 transition">
          👥 Manage Friends
        </button>
        <button className="w-full py-3 bg-slate-900 rounded-xl font-semibold border border-slate-800 hover:border-red-500/50 hover:bg-red-500/10 transition text-red-400">
          🚪 Log Out
        </button>
      </div>
    </div>
  );
};

export default Profile;