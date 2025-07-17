"use client";

import { useAuth } from "@clerk/nextjs";

export default function GetTokenButton() {
  const { getToken } = useAuth();

  const handleGetToken = async () => {
    try {
      const token = await getToken({ template: "skills" }); // 👈 template name must match
      console.log("✅ JWT Token:", token);
    } catch (error) {
      console.error("❌ Failed to get token:", error);
    }
  };

  return (
    <div className="p-4 mt-32">
      <button
        onClick={handleGetToken}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        Get JWT Token
      </button>
    </div>
  );
}
