import { Link, useLocation } from "react-router-dom";
// Navbar is the "control center" for app's navigation. It uses React Router to switch pages without the browser having to refresh the entire website.
const Navbar = () => {
  const location = useLocation(); // holds current location to highlight later on
  
  const navItems = [
    { path: "/", icon: "🏠", label: "Home" },
    { path: "/friends", icon: "👥", label: "Friends" },
    { path: "/capture", icon: "", label: "" },
    { path: "/profile", icon: "👤", label: "Profile" },
  ];

  return (
    <>
      {/* Bottom Navigation Only */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/50">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between px-4 py-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              // Special center button for capture
              if (item.path === "/capture") {
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="relative -top-6"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-pink-500 rounded-full blur-md opacity-70"></div>
                      <div className="relative w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-pink-500 flex items-center justify-center shadow-2xl">
                        <span className="text-2xl">📸</span>
                      </div>
                    </div>
                  </Link>
                );
              }
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center justify-center transition-all duration-200 ${
                    isActive ? "transform -translate-y-1" : ""
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`text-2xl p-2 rounded-full transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-amber-500/20 to-pink-500/20 text-amber-300"
                        : "text-slate-400 hover:text-slate-300"
                    }`}
                  >
                    {item.icon}
                  </div>
                  
                  {/* Label */}
                  <span
                    className={`text-xs mt-1 font-medium transition-all duration-200 ${
                      isActive // if true color changes
                        ? "text-amber-400 font-semibold"
                        : "text-slate-500"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;