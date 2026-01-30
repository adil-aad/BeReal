const Layout = ({ children }) => {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md min-h-screen bg-black">
        {children}
      </div>
    </div>
  );
};

export default Layout;
