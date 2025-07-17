"use client";

import { useRouter } from "next/navigation";
import { useUser, useSignUp } from "@clerk/nextjs";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";

const SignupPage = () => {
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const { signUp, isLoaded } = useSignUp();

  const [formData, setFormData] = useState({
    role: "INSTRUCTOR",
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Email/Password Signup Handler
  const handleEmailSignup = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/auth/register", formData);
      toast.success(res?.data?.message || "Signup successful!");
      router.push(`/send-email/data?user_email=${formData.email}`);
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Auto Save OAuth User to Backend
useEffect(() => {
  if (isSignedIn && user) {
    const saveUserToDB = async () => {
      try {
        await axiosInstance.post("/api/auth/register", {
          role: "INSTRUCTOR", // ✅ change this line
          name: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
          password: "social_oauth",
        }).then(() => {
          toast.success(res.data.message || "User saved successfully");
          router.push("/courses");
        });
      } catch (err) {
        const exists = err?.response?.data?.message || err.message;
        if (exists !== "User already exists") {
          // toast.error(exists);
          router.push("/courses");
        }
      }
    };
    saveUserToDB();
  }
}, [user, isSignedIn]);


  // ✅ Social Signup
  const handleSocialLogin = async (provider) => {
    if (!isLoaded || !signUp) return;
    try {
      await signUp.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: `${window.location.origin}/instructor-808/signup`,
      });
    } catch (err) {
      toast.error("OAuth failed!");
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-center text-4xl font-extrabold text-blue-600">Join SkillNova</h1>

        {/* Email Form */}
        <form noValidate className="space-y-5">
          <InputField label="Role"  name="role" value={formData.role} disabled />
          <InputField label="Name" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <InputField label="Email" name="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <InputField label="Password" name="password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />

          {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500">{error}</div>}

          <button
            type="button" 
            onClick={handleEmailSignup}
            disabled={loading}
            className="w-full rounded-full cursor-pointer bg-blue-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-3 text-gray-500 font-medium">OR SIGN UP WITH</span>
          </div>
        </div>

        {/* Social Logins */}
        <div className="space-y-3 mb-8">
          <SocialButton label="Google" icon="https://cdn.iconscout.com/icon/free/png-256/google-160-189824.png" onClick={() => handleSocialLogin("google")} />
          <SocialButton label="GitHub" icon="https://cdn-icons-png.flaticon.com/512/25/25231.png" onClick={() => handleSocialLogin("github")} />
          <SocialButton label="Facebook" icon="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/2048px-2023_Facebook_icon.svg.png" onClick={() => handleSocialLogin("facebook")} />
        </div>
      </div>
    </div>
  );
};

// 🔧 Reusable Components
const InputField = ({ label, name, value, onChange, disabled, type = "text", placeholder }) => (
  <div className="space-y-1">
    <label className={`${disabled ? "hidden" : ""} block text-sm font-semibold text-gray-700`}>{label}</label>
    <div
      className={`overflow-hidden rounded-3xl border border-gray-200 px-4 py-3 ${
        disabled
          ? "bg-gray-100 hidden"
          : "focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
      }`}
    >
      <input
        name={name}
        type={type}
        disabled={disabled}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-transparent text-base outline-none text-gray-800 `}
      />
    </div>
  </div>
);

const SocialButton = ({ label, icon, onClick }) => (
  <button
    onClick={onClick}
    type="button"
    className="flex w-full items-center justify-center gap-3 rounded-3xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
  >
    <img src={icon} alt={`${label} icon`} className="h-6 w-6" />
    Continue with {label}
  </button>
);

export default SignupPage;
