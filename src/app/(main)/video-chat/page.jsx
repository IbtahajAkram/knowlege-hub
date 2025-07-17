"use client"
import { useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Home() {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerConnection = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      localVideoRef.current.srcObject = stream;

      peerConnection.current = new RTCPeerConnection();

      stream.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, stream);
      });

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", event.candidate);
        }
      };

      peerConnection.current.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      socket.on("offer", async (offer) => {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        socket.emit("answer", answer);
      });

      socket.on("answer", async (answer) => {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
      });

      socket.on("ice-candidate", async (candidate) => {
        try {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error("Error adding received ice candidate", e);
        }
      });
    });
  }, []);

  const call = async () => {
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.emit("offer", offer);
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col items-center justify-center space-y-4">
      <h1 className="text-3xl font-bold mb-4">🔴 WebRTC Video Call</h1>
      <div className="flex space-x-4">
        <video ref={localVideoRef} autoPlay muted className="w-64 h-48 bg-black" />
        <video ref={remoteVideoRef} autoPlay className="w-64 h-48 bg-black" />
      </div>
      <button
        onClick={call}
        className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 rounded text-lg"
      >
        Start Call
      </button>
    </div>
  );
}
