import { useParams } from "react-router-dom";
import Navbar from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useVoteVerification } from "../hooks/useVoteVerification";

const Vote = () => {
  const { projectId } = useParams();
  
  // Inject Layer 2
  const {
    isBlockedRole, currentUserRole, modelsLoaded,
    videoRef, canvasRef, name, setName, image, cameraStarted, 
    videoReady, isDetecting, livenessMsg, verificationProgress,
    startCamera, startLivenessCheck, retakePhoto, submitVote
  } = useVoteVerification(projectId);

  // SVG Math
  const radius = 134;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (verificationProgress / 100) * circumference;

  const handleSubmit = (e) => {
    e.preventDefault();
    submitVote();
  };

  if (isBlockedRole) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900 flex justify-center items-center p-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-8 w-full max-w-md text-center border-t-4 border-red-500">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
          <p className="text-slate-300 font-medium">
            As an {currentUserRole ? currentUserRole.charAt(0).toUpperCase() + currentUserRole.slice(1) : "Admin/Organizer"}, you are not permitted to vote in this project.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900 flex justify-center items-center p-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 w-full max-w-lg">
          <div className="text-center mb-6">
            <h2 className="text-4xl font-extrabold bg-linear-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              Vote Verification
            </h2>
            <p className="text-slate-400 text-sm mt-2">Liveness & Facial Match</p>
          </div>

          {!modelsLoaded ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
              <span className="ml-3 font-semibold text-indigo-600">Loading AI Models...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
              
              <div className="w-full mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" className="w-full bg-slate-800/70 border border-slate-700 text-white placeholder-slate-400 p-3 rounded-xl focus:outline-none focus:border-cyan-400 text-center" required />
              </div>

              <div className="relative mb-6">
                {!cameraStarted && !image && (
                  <div className="w-72 h-72 flex flex-col items-center justify-center mx-auto">
                    <div className="w-64 h-64 bg-slate-900/70 rounded-full flex flex-col items-center justify-center border-4 border-dashed border-cyan-500/40">
                      <span className="text-slate-400 text-sm mb-4">Camera inactive</span>
                      <button type="button" onClick={startCamera} className="bg-linear-to-r from-cyan-500 to-violet-600 hover:opacity-90 text-white px-6 py-2 rounded-full shadow-md transition">
                        Open Camera
                      </button>
                    </div>
                  </div>
                )}

                {cameraStarted && !image && (
                  <div className="relative w-72 h-72 mx-auto flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none">
                      <circle cx="144" cy="144" r={radius} stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-700" />
                      <circle cx="144" cy="144" r={radius} stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" className="text-green-500 transition-all duration-300 ease-in-out" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} />
                    </svg>

                    <div className="relative w-64 h-64 rounded-full overflow-hidden bg-black shadow-lg">
                      {/* Attach Layer 2 video ref here */}
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="absolute w-[1px] h-full bg-white/40"></div>
                        <div className="absolute h-[1px] w-full bg-white/40"></div>
                        <div className="absolute w-40 h-40 rounded-full border border-dashed border-white/60"></div>
                      </div>
                    </div>
                  </div>
                )}

                {image && (
                  <div className="relative w-72 h-72 mx-auto flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none">
                      <circle cx="144" cy="144" r={radius} stroke="currentColor" strokeWidth="8" fill="none" className="text-cyan-400" />
                    </svg>
                    <div className="relative w-64 h-64 rounded-full overflow-hidden shadow-lg">
                      <img src={image} alt="Captured face" className="w-full h-full object-cover transform -scale-x-100" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center justify-center mb-6 min-h-[60px] max-w-xs text-center">
                <p className="text-slate-300 text-sm font-medium">
                  {livenessMsg ? <span className="text-cyan-400 font-bold">{livenessMsg}</span> : cameraStarted ? "Hold steady and prepare to verify." : image ? "Face captured successfully. You can retake if the image is blurry." : "We need to verify your identity to process your vote."}
                </p>

                {isDetecting && verificationProgress > 0 && verificationProgress < 100 && (
                  <div className="flex items-center gap-4 mt-3 text-indigo-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 animate-[bounce_1s_infinite] rotate-90"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" /></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 animate-[bounce_1s_infinite] -rotate-90"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" /></svg>
                  </div>
                )}
              </div>

              <div className="w-full space-y-3">
                {cameraStarted && (
                  <button type="button" onClick={startLivenessCheck} disabled={isDetecting || !videoReady} className="w-full bg-linear-to-r from-cyan-500 to-violet-600 hover:opacity-90 text-white py-3 rounded-xl transition font-semibold disabled:bg-green-300 shadow-md flex justify-center items-center">
                    {isDetecting ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>Verifying... {verificationProgress}%</> : videoReady ? "Start Verification" : "Starting camera..."}
                  </button>
                )}
                {image && (
                  <button type="button" onClick={retakePhoto} className="w-full bg-slate-800 text-white hover:bg-slate-700 border border-slate-600 py-3 rounded-xl transition font-medium">
                    Retake Photo
                  </button>
                )}
                <button type="submit" disabled={!image || !name || isDetecting} className="w-full bg-linear-to-r from-cyan-500 to-violet-600 hover:opacity-90 text-white py-3 rounded-xl font-bold text-lg disabled:bg-indigo-300 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2">
                  Submit Vote
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </button>
              </div>
              
              {/* Attach Layer 2 canvas ref here */}
              <canvas ref={canvasRef} className="hidden" />
            </form>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Vote;