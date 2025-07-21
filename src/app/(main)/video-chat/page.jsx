//   "use client"
//   import { useEffect, useRef, useState } from "react";
//   import { Video, VideoOff, Phone, PhoneOff, Mic, MicOff, Settings, Users, Wifi, WifiOff } from 'lucide-react';
//   import io from "socket.io-client";

//   const socket = io("https://18ac272e173f.ngrok-free.app/");
// .....
//   export default function App() {
//     const localVideoRef = useRef(null);
//     const remoteVideoRef = useRef(null);
//     const peerConnection = useRef(null);
//     const [isConnected, setIsConnected] = useState(false);
//     const [isVideoEnabled, setIsVideoEnabled] = useState(true);
//     const [isAudioEnabled, setIsAudioEnabled] = useState(true);
//     const [connectionStatus, setConnectionStatus] = useState('disconnected');
//     const [localStream, setLocalStream] = useState(null);

//     useEffect(() => {
//       navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
//         if (localVideoRef.current) {
//           localVideoRef.current.srcObject = stream;
//         }
//         setLocalStream(stream);

//         peerConnection.current = new RTCPeerConnection({
//           iceServers: [
//             { urls: 'stun:stun.l.google.com:19302' }
//           ]
//         });

//         stream.getTracks().forEach(track => {
//           peerConnection.current?.addTrack(track, stream);
//         });

//         peerConnection.current.onicecandidate = (event) => {
//           if (event.candidate) {
//             socket.emit("ice-candidate", event.candidate);
//           }
//         };

//         peerConnection.current.ontrack = (event) => {
//           if (remoteVideoRef.current) {
//             remoteVideoRef.current.srcObject = event.streams[0];
//             setIsConnected(true);
//             setConnectionStatus('connected');
//           }
//         };

//         peerConnection.current.onconnectionstatechange = () => {
//           const state = peerConnection.current?.connectionState;
//           if (state === 'connected') {
//             setConnectionStatus('connected');
//             setIsConnected(true);
//           } else if (state === 'connecting') {
//             setConnectionStatus('connecting');
//           } else if (state === 'disconnected' || state === 'failed') {
//             setConnectionStatus('disconnected');
//             setIsConnected(false);
//           }
//         };

//         socket.on("offer", async (offer) => {
//           if (peerConnection.current) {
//             await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
//             const answer = await peerConnection.current.createAnswer();
//             await peerConnection.current.setLocalDescription(answer);
//             socket.emit("answer", answer);
//           }
//         });

//         socket.on("answer", async (answer) => {
//           if (peerConnection.current) {
//             await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
//           }
//         });

//         socket.on("ice-candidate", async (candidate) => {
//           try {
//             if (peerConnection.current) {
//               await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
//             }
//           } catch (e) {
//             console.error("Error adding received ice candidate", e);
//           }
//         });
//       });

//       return () => {
//         if (localStream) {
//           localStream.getTracks().forEach(track => track.stop());
//         }
//         if (peerConnection.current) {
//           peerConnection.current.close();
//         }
//       };
//     }, []);

//     const call = async () => {
//       if (peerConnection.current) {
//         setConnectionStatus('connecting');
//         const offer = await peerConnection.current.createOffer();
//         await peerConnection.current.setLocalDescription(offer);
//         socket.emit("offer", offer);
//       }
//     };

//     const toggleVideo = () => {
//       if (localStream) {
//         const videoTrack = localStream.getVideoTracks()[0];
//         if (videoTrack) {
//           videoTrack.enabled = !videoTrack.enabled;
//           setIsVideoEnabled(videoTrack.enabled);
//         }
//       }
//     };

//     const toggleAudio = () => {
//       if (localStream) {
//         const audioTrack = localStream.getAudioTracks()[0];
//         if (audioTrack) {
//           audioTrack.enabled = !audioTrack.enabled;
//           setIsAudioEnabled(audioTrack.enabled);
//         }
//       }
//     };

//     const endCall = () => {
//       if (peerConnection.current) {
//         peerConnection.current.close();
//       }
//       if (remoteVideoRef.current) {
//         remoteVideoRef.current.srcObject = null;
//       }
//       setIsConnected(false);
//       setConnectionStatus('disconnected');
//     };

//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
//         {/* Animated Background */}
//         <div className="absolute inset-0 overflow-hidden">
//           <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
//           <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
//           <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
//         </div>

//         {/* Header */}
//         <div className="relative z-10 p-6 backdrop-blur-sm">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
//                 <Video className="h-8 w-8" />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
//                   WebRTC Video Call
//                 </h1>
//                 <p className="text-gray-400 text-sm">Premium video calling experience</p>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-6">
//               <div className="flex items-center gap-3 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2">
//                 {connectionStatus === 'connected' ? (
//                   <Wifi className="h-5 w-5 text-green-400" />
//                 ) : (
//                   <WifiOff className="h-5 w-5 text-red-400" />
//                 )}
//                 <div className="flex items-center gap-2">
//                   <div className={`w-2 h-2 rounded-full ${
//                     connectionStatus === 'connected' ? 'bg-green-400' : 
//                     connectionStatus === 'connecting' ? 'bg-yellow-400' : 'bg-red-400'
//                   } animate-pulse`} />
//                   <span className="text-sm font-medium capitalize">{connectionStatus}</span>
//                 </div>
//               </div>
              
//               <button className="p-3 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110">
//                 <Settings className="h-6 w-6" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="relative z-10 flex-1 flex items-center justify-center p-6">
//           <div className="w-full max-w-6xl">
//             {/* Video Grid */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//               {/* Local Video */}
//               <div className="relative group">
//                 <div className="rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-green-400/10 to-emerald-600/10 backdrop-blur-sm border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
//                   <div className="aspect-video bg-black relative">
//                     <video
//                       ref={localVideoRef}
//                       autoPlay
//                       muted
//                       className="w-full h-full object-cover"
//                     />
//                     {!isVideoEnabled && (
//                       <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
//                         <div className="text-center">
//                           <div className="p-4 bg-gray-700 rounded-full mb-4 mx-auto w-fit">
//                             <VideoOff className="h-8 w-8 text-gray-400" />
//                           </div>
//                           <p className="text-gray-400 font-medium">Camera is off</p>
//                         </div>
//                       </div>
//                     )}
                    
//                     {/* Video Label */}
//                     <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2">
//                       <div className="flex items-center gap-2">
//                         <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
//                         <span className="text-sm font-semibold">You</span>
//                       </div>
//                     </div>

//                     {/* Video Controls Overlay */}
//                     <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                       <div className="flex items-center gap-2">
//                         {isVideoEnabled ? (
//                           <Video className="h-4 w-4 text-green-400" />
//                         ) : (
//                           <VideoOff className="h-4 w-4 text-red-400" />
//                         )}
//                         {isAudioEnabled ? (
//                           <Mic className="h-4 w-4 text-green-400" />
//                         ) : (
//                           <MicOff className="h-4 w-4 text-red-400" />
//                         )}
//                       </div>
//                       <div className="text-xs text-gray-300 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
//                         Local Stream
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Video Info Bar */}
//                   <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-t border-green-400/20">
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm font-medium text-green-400">Your Video</span>
//                       <div className="flex items-center gap-2 text-xs text-gray-400">
//                         <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
//                         Active
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Remote Video */}
//               <div className="relative group">
//                 <div className="rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-400/10 to-purple-600/10 backdrop-blur-sm border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300">
//                   <div className="aspect-video bg-black relative">
//                     <video
//                       ref={remoteVideoRef}
//                       autoPlay
//                       className="w-full h-full object-cover"
//                     />
//                     {!isConnected && (
//                       <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
//                         <div className="text-center">
//                           <div className="p-4 bg-gray-700 rounded-full mb-4 mx-auto w-fit animate-pulse">
//                             <Users className="h-8 w-8 text-gray-400" />
//                           </div>
//                           <p className="text-gray-400 font-medium mb-2">Waiting for connection...</p>
//                           <div className="flex items-center justify-center gap-1">
//                             <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
//                             <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
//                             <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
//                           </div>
//                         </div>
//                       </div>
//                     )}
                    
//                     {/* Video Label */}
//                     <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2">
//                       <div className="flex items-center gap-2">
//                         <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-blue-400 animate-pulse' : 'bg-gray-400'}`} />
//                         <span className="text-sm font-semibold">Remote</span>
//                       </div>
//                     </div>

//                     {/* Video Controls Overlay */}
//                     <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                       <div className="flex items-center gap-2">
//                         <Video className={`h-4 w-4 ${isConnected ? 'text-blue-400' : 'text-gray-400'}`} />
//                         <Mic className={`h-4 w-4 ${isConnected ? 'text-blue-400' : 'text-gray-400'}`} />
//                       </div>
//                       <div className="text-xs text-gray-300 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
//                         Remote Stream
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Video Info Bar */}
//                   <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-t border-blue-400/20">
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm font-medium text-blue-400">Remote Video</span>
//                       <div className="flex items-center gap-2 text-xs text-gray-400">
//                         <div className={`w-1 h-1 rounded-full ${isConnected ? 'bg-blue-400 animate-pulse' : 'bg-gray-400'}`} />
//                         {isConnected ? 'Connected' : 'Waiting'}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Control Panel */}
//             <div className="flex items-center justify-center">
//               <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
//                 <div className="flex items-center gap-4">
//                   {/* Video Toggle */}
//                   <button
//                     onClick={toggleVideo}
//                     className={`p-4 rounded-full transition-all duration-200 hover:scale-110 ${
//                       isVideoEnabled
//                         ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
//                         : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
//                     }`}
//                   >
//                     {isVideoEnabled ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
//                   </button>

//                   {/* Audio Toggle */}
//                   <button
//                     onClick={toggleAudio}
//                     className={`p-4 rounded-full transition-all duration-200 hover:scale-110 ${
//                       isAudioEnabled
//                         ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
//                         : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
//                     }`}
//                   >
//                     {isAudioEnabled ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
//                   </button>

//                   {/* Call Button */}
//                   {!isConnected && connectionStatus !== 'connecting' ? (
//                     <button
//                       onClick={call}
//                       className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-full shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-3"
//                     >
//                       <Phone className="h-6 w-6" />
//                       Start Call
//                     </button>
//                   ) : connectionStatus === 'connecting' ? (
//                     <button
//                       disabled
//                       className="px-8 py-4 bg-yellow-500/20 text-yellow-400 font-semibold rounded-full shadow-lg flex items-center gap-3 cursor-not-allowed"
//                     >
//                       <div className="animate-spin rounded-full h-6 w-6 border-2 border-yellow-400 border-t-transparent" />
//                       Connecting...
//                     </button>
//                   ) : (
//                     <button
//                       onClick={endCall}
//                       className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-full shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-3"
//                     >
//                       <PhoneOff className="h-6 w-6" />
//                       End Call
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     )}

"use client"
import { useEffect, useRef, useState } from "react";
import { Video, VideoOff, Phone, PhoneOff, Mic, MicOff, Settings, Users, Wifi, WifiOff } from 'lucide-react';
import io from "socket.io-client";

const socket = io("https://eaa96d7f64c0.ngrok-free.app/", {
        transports: ["websocket"],
        secure: true,
        forceNew: true,
        reconnectionAttempts: 5,
        timeout: 10000,
      });
export default function App() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [localStream, setLocalStream] = useState(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setLocalStream(stream);

     peerConnection.current = new RTCPeerConnection({
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject'
    },
    {
      urls: 'turn:openrelay.metered.ca:443',
      username: 'openrelayproject',
      credential: 'openrelayproject'
    }
  ]
});


      stream.getTracks().forEach(track => {
        peerConnection.current?.addTrack(track, stream);
      });

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", event.candidate);
        }
      };

      peerConnection.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
          setIsConnected(true);
          setConnectionStatus('connected');
        }
      };

      peerConnection.current.onconnectionstatechange = () => {
        const state = peerConnection.current?.connectionState;
        if (state === 'connected') {
          setConnectionStatus('connected');
          setIsConnected(true);
        } else if (state === 'connecting') {
          setConnectionStatus('connecting');
        } else if (state === 'disconnected' || state === 'failed') {
          setConnectionStatus('disconnected');
          setIsConnected(false);
        }
      };

      socket.on("offer", async (offer) => {
        if (peerConnection.current) {
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);
          socket.emit("answer", answer);
        }
      });

      socket.on("answer", async (answer) => {
        if (peerConnection.current) {
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
        }
      });

      socket.on("ice-candidate", async (candidate) => {
        try {
          if (peerConnection.current) {
            await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
          }
        } catch (e) {
          console.error("Error adding received ice candidate", e);
        }
      });
    });

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
  }, []);

  const call = async () => {
    if (peerConnection.current) {
      setConnectionStatus('connecting');
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      socket.emit("offer", offer);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const endCall = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    setIsConnected(false);
    setConnectionStatus('disconnected');
  };

  return (
    <div className="min-h-screen mt-32 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
              <Video className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                WebRTC Video Call
              </h1>
              <p className="text-gray-400 text-sm">Premium video calling experience</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2">
              {connectionStatus === 'connected' ? (
                <Wifi className="h-5 w-5 text-green-400" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-400" />
              )}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-400' : 
                  connectionStatus === 'connecting' ? 'bg-yellow-400' : 'bg-red-400'
                } animate-pulse`} />
                <span className="text-sm font-medium capitalize">{connectionStatus}</span>
              </div>
            </div>
            
            <button className="p-3 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110">
              <Settings className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-6xl">
          {/* Video Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Local Video */}
            <div className="relative group">
              <div className="rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-green-400/10 to-emerald-600/10 backdrop-blur-sm border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
                <div className="aspect-video bg-black relative">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  />
                  {!isVideoEnabled && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <div className="text-center">
                        <div className="p-4 bg-gray-700 rounded-full mb-4 mx-auto w-fit">
                          <VideoOff className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-400 font-medium">Camera is off</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Video Label */}
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-sm font-semibold">You</span>
                    </div>
                  </div>

                  {/* Video Controls Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-2">
                      {isVideoEnabled ? (
                        <Video className="h-4 w-4 text-green-400" />
                      ) : (
                        <VideoOff className="h-4 w-4 text-red-400" />
                      )}
                      {isAudioEnabled ? (
                        <Mic className="h-4 w-4 text-green-400" />
                      ) : (
                        <MicOff className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                    <div className="text-xs text-gray-300 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
                      Local Stream
                    </div>
                  </div>
                </div>
                
                {/* Video Info Bar */}
                <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-t border-green-400/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-400">Your Video</span>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
                      Active
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Remote Video */}
            <div className="relative group">
              <div className="rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-400/10 to-purple-600/10 backdrop-blur-sm border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300">
                <div className="aspect-video bg-black relative">
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                  {!isConnected && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <div className="text-center">
                        <div className="p-4 bg-gray-700 rounded-full mb-4 mx-auto w-fit animate-pulse">
                          <Users className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-400 font-medium mb-2">Waiting for connection...</p>
                        <div className="flex items-center justify-center gap-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Video Label */}
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-blue-400 animate-pulse' : 'bg-gray-400'}`} />
                      <span className="text-sm font-semibold">Remote</span>
                    </div>
                  </div>

                  {/* Video Controls Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-2">
                      <Video className={`h-4 w-4 ${isConnected ? 'text-blue-400' : 'text-gray-400'}`} />
                      <Mic className={`h-4 w-4 ${isConnected ? 'text-blue-400' : 'text-gray-400'}`} />
                    </div>
                    <div className="text-xs text-gray-300 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
                      Remote Stream
                    </div>
                  </div>
                </div>
                
                {/* Video Info Bar */}
                <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-t border-blue-400/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-400">Remote Video</span>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <div className={`w-1 h-1 rounded-full ${isConnected ? 'bg-blue-400 animate-pulse' : 'bg-gray-400'}`} />
                      {isConnected ? 'Connected' : 'Waiting'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="flex items-center justify-center">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-4">
                {/* Video Toggle */}
                <button
                  onClick={toggleVideo}
                  className={`p-4 rounded-full transition-all duration-200 hover:scale-110 ${
                    isVideoEnabled
                      ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                      : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  }`}
                >
                  {isVideoEnabled ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
                </button>

                {/* Audio Toggle */}
                <button
                  onClick={toggleAudio}
                  className={`p-4 rounded-full transition-all duration-200 hover:scale-110 ${
                    isAudioEnabled
                      ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                      : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  }`}
                >
                  {isAudioEnabled ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
                </button>

                {/* Call Button */}
                {!isConnected && connectionStatus !== 'connecting' ? (
                  <button
                    onClick={call}
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-full shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-3"
                  >
                    <Phone className="h-6 w-6" />
                    Start Call
                  </button>
                ) : connectionStatus === 'connecting' ? (
                  <button
                    disabled
                    className="px-8 py-4 bg-yellow-500/20 text-yellow-400 font-semibold rounded-full shadow-lg flex items-center gap-3 cursor-not-allowed"
                  >
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-yellow-400 border-t-transparent" />
                    Connecting...
                  </button>
                ) : (
                  <button
                    onClick={endCall}
                    className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-full shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-3"
                  >
                    <PhoneOff className="h-6 w-6" />
                    End Call
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}