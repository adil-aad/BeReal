import { useState, useRef, useEffect } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const Capture = () => {
  const [front, setFront] = useState(null);
  const [back, setBack] = useState(null);
  const [caption, setCaption] = useState("");
  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraType, setCameraType] = useState("back");
  const [flash, setFlash] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isCounting, setIsCounting] = useState(false);
  const navigate = useNavigate();
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const frontFileRef = useRef(null);
  const backFileRef = useRef(null);

  // Mock users that will see your post
  const friends = [
    { name: "Alex", avatar: "A", isOnline: true },
    { name: "Sam", avatar: "S", isOnline: true },
    { name: "Jordan", avatar: "J", isOnline: true },
    { name: "Taylor", avatar: "T", isOnline: false },
  ];

  useEffect(() => {
    if (isCameraActive) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isCameraActive, cameraType]);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: cameraType === "front" ? "user" : "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsCounting(true);
    let count = 3;
    const countdownInterval = setInterval(() => {
      count--;
      setCountdown(count);
      if (count === 0) {
        clearInterval(countdownInterval);
        takeSnapshot();
      }
    }, 1000);
  };

  const takeSnapshot = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to blob
    canvas.toBlob((blob) => {
      const file = new File([blob], `${cameraType}-${Date.now()}.jpg`, { type: 'image/jpeg' });
      const previewUrl = URL.createObjectURL(blob);
      
      if (cameraType === "front") {
        setFront(file);
        setFrontPreview(previewUrl);
      } else {
        setBack(file);
        setBackPreview(previewUrl);
      }
      
      setFlash(true);
      setTimeout(() => setFlash(false), 200);
      setIsCounting(false);
      setCountdown(3);
      setIsCameraActive(false);
    }, 'image/jpeg', 0.9);
  };

  // used for file upload
  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const previewUrl = URL.createObjectURL(file);
    
    if (type === "front") {
      setFront(file);
      setFrontPreview(previewUrl);
    } else {
      setBack(file);
      setBackPreview(previewUrl);
    }
  };

  const switchCamera = () => {
    setCameraType(prev => prev === "front" ? "back" : "front");
  };

  const submitPost = async () => {
    if (!front || !back) {
      alert("Please capture both photos!");
      return;
    }

    setIsUploading(true);
    try {
      const data = new FormData();
      data.append("front", front);
      data.append("back", back);
      data.append("caption", caption);
      
      await API.post("/posts", data);
      
      // Show success animation
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Error posting:", error);
      setIsUploading(false);
      alert("Failed to post. Please try again.");
    }
  };

  return (
    <Layout>
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-amber-900/10 via-purple-900/10 to-pink-900/10 pointer-events-none"></div>
      
      {/* Magic Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 bg-amber-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-gradient-to-b from-slate-950/95 to-transparent backdrop-blur-lg pt-6 pb-4 px-4">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-slate-800/50 rounded-full transition"
              >
                <span className="text-2xl">←</span>
              </button>
              <div className="text-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-pink-400 bg-clip-text text-transparent">
                  Capture BeReal
                </h1>
                <p className="text-xs text-slate-400">Your daily authentic moment</p>
              </div>
              <button className="p-2 hover:bg-slate-800/50 rounded-full transition">
                <span className="text-xl">⚙️</span>
              </button>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {[1, 2, 3].map((step) => (
                <div 
                  key={step}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    step === 1 ? 'w-8 bg-gradient-to-r from-amber-500 to-pink-500' :
                    step === 2 && (front || back) ? 'w-8 bg-gradient-to-r from-amber-500 to-pink-500' :
                    step === 3 && front && back ? 'w-8 bg-gradient-to-r from-amber-500 to-pink-500' :
                    'w-4 bg-slate-700'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 pb-32 pt-4">
          <div className="max-w-md mx-auto">
            {/* Dual Camera Preview */}
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border-2 border-slate-700/50 shadow-2xl mb-6">
              {/* Back Camera Preview */}
              <div className="absolute inset-0">
                {backPreview ? (
                  <img 
                    src={backPreview} 
                    alt="Back camera" 
                    className="w-full h-full object-cover"
                  />
                ) : isCameraActive && cameraType === "back" ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🌆</div>
                      <p className="text-slate-400">Back camera</p>
                      <p className="text-sm text-slate-500">Show what you're seeing</p>
                    </div>
                  </div>
                )}
                
                {/* Camera Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                
                {/* Flash Effect */}
                {flash && cameraType === "back" && (
                  <div className="absolute inset-0 bg-white animate-ping"></div>
                )}
              </div>

              {/* Front Camera PIP */}
              <div className="absolute top-4 left-4 z-20">
                <div className="relative group">
                  <div className={`w-24 h-32 rounded-xl overflow-hidden border-3 ${frontPreview ? 'border-emerald-500' : 'border-slate-600'} shadow-xl`}>
                    {frontPreview ? (
                      <img 
                        src={frontPreview} 
                        alt="Front camera" 
                        className="w-full h-full object-cover"
                      />
                    ) : isCameraActive && cameraType === "front" ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                        <span className="text-2xl">🤳</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Flash Effect */}
                  {flash && cameraType === "front" && (
                    <div className="absolute inset-0 bg-white animate-ping"></div>
                  )}
                  
                  {/* Camera Icon */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-5 h-5 bg-slate-900 rounded-full"></div>
                  </div>
                  
                  {/* Label */}
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-white text-slate-900 text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">
                    {frontPreview ? '✓ Front' : 'Front Cam'}
                  </div>
                </div>
              </div>

              {/* Countdown Overlay */}
              {isCounting && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                  <div className="text-white text-8xl font-bold animate-bounce">
                    {countdown}
                  </div>
                </div>
              )}

              {/* Camera Controls Overlay */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-6">
                <button 
                  onClick={switchCamera}
                  className="p-3 bg-slate-900/80 backdrop-blur-sm rounded-full hover:bg-slate-800/80 transition"
                >
                  <span className="text-2xl">🔄</span>
                </button>
                
                <button 
                  onClick={capturePhoto}
                  disabled={isCounting}
                  className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform disabled:opacity-50"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-pink-500"></div>
                </button>
                
                <button 
                  onClick={() => setFlash(!flash)}
                  className={`p-3 backdrop-blur-sm rounded-full transition ${flash ? 'bg-amber-500/20' : 'bg-slate-900/80 hover:bg-slate-800/80'}`}
                >
                  <span className="text-2xl">{flash ? '⚡' : '⚡️'}</span>
                </button>
              </div>
            </div>

            {/* Capture Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button 
                onClick={() => {
                  setCameraType("front");
                  setIsCameraActive(true);
                }}
                className={`py-3 rounded-xl flex items-center justify-center gap-2 transition ${frontPreview ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-slate-800/50 border border-slate-700/50 hover:border-amber-500/30'}`}
              >
                <span className="text-xl">{frontPreview ? '✅' : '📱'}</span>
                <span className="font-medium">{frontPreview ? 'Front Captured' : 'Capture Front'}</span>
              </button>
              
              <button 
                onClick={() => {
                  setCameraType("back");
                  setIsCameraActive(true);
                }}
                className={`py-3 rounded-xl flex items-center justify-center gap-2 transition ${backPreview ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-slate-800/50 border border-slate-700/50 hover:border-amber-500/30'}`}
              >
                <span className="text-xl">{backPreview ? '✅' : '🌆'}</span>
                <span className="font-medium">{backPreview ? 'Back Captured' : 'Capture Back'}</span>
              </button>
            </div>

            {/* File Upload Fallback */}
            <div className="mb-6">
              <p className="text-sm text-slate-400 text-center mb-3">Or upload photos</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="file"
                    ref={frontFileRef}
                    onChange={(e) => handleFileSelect(e, "front")}
                    accept="image/*"
                    capture="user"
                    className="hidden"
                  />
                  <button
                    onClick={() => frontFileRef.current?.click()}
                    className="w-full py-3 bg-slate-800/30 rounded-xl border border-dashed border-slate-700/50 hover:border-amber-500/50 transition"
                  >
                    <div className="text-2xl mb-2">📁</div>
                    <div className="text-sm">Upload Front</div>
                  </button>
                </div>
                <div>
                  <input
                    type="file"
                    ref={backFileRef}
                    onChange={(e) => handleFileSelect(e, "back")}
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                  />
                  <button
                    onClick={() => backFileRef.current?.click()}
                    className="w-full py-3 bg-slate-800/30 rounded-xl border border-dashed border-slate-700/50 hover:border-amber-500/50 transition"
                  >
                    <div className="text-2xl mb-2">📁</div>
                    <div className="text-sm">Upload Back</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Caption Input */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Add a caption <span className="text-slate-500">(optional)</span>
              </label>
              <div className="relative">
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="What's happening in this moment? 💭"
                  className="w-full bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent resize-none min-h-[100px]"
                  maxLength="200"
                />
                <div className="absolute bottom-3 right-3 text-xs text-slate-500">
                  {caption.length}/200
                </div>
              </div>
            </div>

            {/* Friends Preview */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Friends will see this</h3>
                <span className="text-sm text-slate-400">{friends.filter(f => f.isOnline).length} online</span>
              </div>
              <div className="flex gap-2">
                {friends.map((friend, idx) => (
                  <div key={idx} className="text-center">
                    <div className={`w-10 h-10 rounded-full ${friend.isOnline ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-slate-700 to-slate-800'} p-0.5`}>
                      <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold">
                        {friend.avatar}
                      </div>
                    </div>
                    <div className="text-xs mt-1">{friend.name}</div>
                  </div>
                ))}
                <button className="w-10 h-10 rounded-full bg-slate-800/50 border border-dashed border-slate-700 flex items-center justify-center hover:border-amber-500/50 transition">
                  <span className="text-lg">+</span>
                </button>
              </div>
            </div>

            {/* Post Button */}
            <button
              onClick={submitPost}
              disabled={!front || !back || isUploading}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                front && back
                  ? 'bg-gradient-to-r from-amber-500 to-pink-500 hover:opacity-90 hover:shadow-2xl hover:shadow-amber-500/25'
                  : 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
              } ${isUploading ? 'animate-pulse' : ''}`}
            >
              {isUploading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Posting your BeReal...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl">✨</span>
                  <span>Post BeReal</span>
                  <span className="text-xl">✨</span>
                </div>
              )}
            </button>

            {/* Upload Progress */}
            {isUploading && (
              <div className="mt-6">
                <div className="h-1.5 bg-slate-800/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-pink-500 animate-progress"></div>
                </div>
                <p className="text-center text-sm text-slate-400 mt-2">
                  Sharing your authentic moment with friends...
                </p>
              </div>
            )}
          </div>
        </div>

        <Navbar />
      </div>

      {/* Success Animation */}
      {isUploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-lg">
          <div className="text-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-amber-500 to-pink-500 animate-ping opacity-20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-amber-500 to-pink-500 flex items-center justify-center animate-bounce">
                  <span className="text-4xl">✅</span>
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold mt-6 mb-2">Posted! 🎉</h3>
            <p className="text-slate-400">Your BeReal is now live</p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Capture;