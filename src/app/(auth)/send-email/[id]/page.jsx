"use client";
import React, { useState } from "react";
import { Mail } from "lucide-react";
import axios from "axios";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";

export default function EmailOtpRequestPage() {
  const searchParams = useSearchParams();
  const userEmail = searchParams.get("user_email")
  const [email, setEmail] = useState(userEmail);
const router = useRouter();
  const handleSubmit = () => {
axiosInstance.post("api/auth/send-email",{email})
.then((res)=>{
  toast.success(res.data.message);
  router.push("/otp-verification?email="+email)
}).catch((err)=>{
  toast.error(err.response.data.message);
})
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-purple-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md text-center space-y-6">
        <div className="flex justify-center text-blue-600">
          <Mail className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-800">Get OTP via Email</h2>
        <p className="text-gray-500">Enter your email address to receive a 6-digit verification code</p>

        <form className="space-y-5">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition duration-300"
          >
            Send OTP
          </button>
        </form>

        <p className="text-sm text-gray-600">
          Already have a code?{" "}
          <span className="text-blue-600 hover:underline cursor-pointer">
            Verify Here
          </span>
        </p>
      </div>
    </div>
  );
}
