// components/OtpPage.jsx
"use client";
import axiosInstance from "@/utils/axiosInstance";
import { ShieldCheck } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
// import { FaMobileAlt } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
export default function OtpPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
const searchParams = useSearchParams();
const email = searchParams.get("email")

const router = useRouter()
    const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Allow only numbers
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
    };

  const handleSubmit = () => {
    const fullOtp = otp.join(""); // "123456"
  axiosInstance.post("/api/auth/otp-verification",{email,otp:fullOtp}) 
  .then((res)=>{
    toast.success(res.data.message);
    router.push("/login");
  }).catch((err)=>{
    toast.error(err.response.data.message);
  })
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md text-center space-y-6">
        <div className="flex justify-center text-blue-600 text-4xl">
              <div className="flex justify-center text-blue-600 text-4xl">
          <ShieldCheck className="w-12 h-12" />
        </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Enter OTP Code</h2>
        <p className="text-gray-500">We’ve sent a 6-digit code to your mobile</p>

        <form  className="space-y-6">
          <div className="flex justify-between space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-12 h-12 text-xl text-center border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              />
            ))}
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-700 cursor-pointer text-white font-semibold rounded-xl hover:opacity-90 transition"
          >
            Verify OTP
          </button>
        </form>

        <p className="text-sm text-gray-500">
          Didn't receive code?{" "}
          <span className="text-blue-600 hover:underline cursor-pointer">
            Resend
          </span>
        </p>
      </div>
    </div>
  );
}
