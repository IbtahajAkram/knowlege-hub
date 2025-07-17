"use client";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleSubmit = () => {
    axiosInstance
      .put("/api/auth/forget-password",{email,password})
      .then((res) => {
        toast.success(res.data.message);
        router.push("/login");
      })
      .catch((err) => {
        toast.error(err.response.data.message || err.message);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen  px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Forgot Password
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Enter your email and your updated password.
        </p>
        <form  className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {email.length > 8 ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter Your New Password
              </label>
              <input
                type="text"
                name="password"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="@1234"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          ) : (
            ""
          )}

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 cursor-pointer transition-all duration-300"
          >
            Update Password
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/login"
            className="text-sm text-blue-600 font-medium hover:underline"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
