"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useSignIn, useUser } from "@clerk/nextjs";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import Link from "next/link";

const LoginPage = () => {
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  const { signIn, isLoaded } = useSignIn();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const userEmail = user?.primaryEmailAddress?.emailAddress || "";
      const { getToken,sessionClaims,sessionId, userId } = useAuth();
console.log(getToken,userId,"userId",sessionClaims,"session claim",sessionId,"its session id")
  const handleEmailLogin = async (email) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/auth/login", { email });
      localStorage.setItem("token", res.data.accessToken);
      toast.success(res?.data?.message || "Login successful!");
      router.push("/courses");
    } catch (err) {
      // const msg = err?.response?.data?.message || err.message;
      setError(msg);
      toast.error(err?.response?.data?.message || err?.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ If user is signed in through Clerk Social Login, sync with backend
  useEffect(() => {
    if (isSignedIn && userEmail) {
      handleEmailLogin(userEmail);
    }
  }, [isSignedIn, userEmail]);
useEffect(() => {
  if (isSignedIn && user) {
    const saveUserToDB = async () => {
      try {
        const res = await axiosInstance.post("/api/auth/login", {
          name: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
          password: "social_oauth", // ⛳ dummy password
        });

        localStorage.setItem("token", res.data.accessToken);
          localStorage.setItem("chatUser",user?.fullName);

        toast.success("Login successful");
         const token = await getToken({ template: "skills" }); // 👈 template name must match
      console.log("✅ JWT Token:", token);
        // router.push("/courses");
      } catch (err) {
        const msg = err?.response?.data?.message || err.message;
        if (msg === "User already exists") {
          router.push("/courses");
        } else {
          toast.error(msg);
        }
      }
    };

    saveUserToDB();
  }
}, [isSignedIn, user]);

  // ✅ Auto-login if Clerk user signs in via social
  // useEffect(() => {
  //   const autoLoginSocialUser = async () => {
  //     if (isSignedIn && user) {
  //       try {
  //         const res = await axiosInstance.post("/api/auth/login", {
  //           email: user.primaryEmailAddress.emailAddress,
  //           password: "social_oauth",
  //         });

  //         localStorage.setItem("token", res.data.accessToken);
  //         toast.success("Welcome back!");
  //         router.push("/courses");
  //       } catch (err) {
  //         // If user is not in DB, auto-register
  //         try {
  //           await axiosInstance.post("/api/auth/register", {
  //             role: "STUDENT",
  //             name: user.fullName,
  //             email: user.primaryEmailAddress.emailAddress,
  //             password: "social_oauth",
  //           });
  //           toast.success("Social account synced! Logging in...");
  //           autoLoginSocialUser(); // Retry login after registering
  //         } catch (registerErr) {
  //           toast.error(registerErr?.response?.data?.message || "Login failed.");
  //         }
  //       }
  //     }
  //   };
  //   autoLoginSocialUser();
  // }, [isSignedIn, user]);

  // ✅ Social login via Clerk
const handleSocialLogin = async (provider) => {
  if (!isLoaded || !signIn) return;
    try {
    await signIn.authenticateWithRedirect({
      strategy: `oauth_${provider}`,
      redirectUrl: `${window.location.origin}/login`,
    });
  } catch (err) {
    console.error("OAuth error:", err);

    const message =
      err?.errors?.[0]?.message ||
      err?.response?.data?.message ||
      err.message;

    // Handle specific Clerk error: Session already exists
    if (message === "Session already exists") {
      toast.info("You're already signed in. Redirecting...");
      window.location.href = "/"; // or router.push("/") if using Next.js router
    } else {
      toast.error("Failed to login with " + provider);
    }
  }
};

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-center text-4xl font-extrabold text-blue-600">Welcome Back</h1>

        <form noValidate className="space-y-5">
          <InputField
            label="Email"
            name="email"
            type="email"
            placeholder={"Enter your email address"}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            placeholder={"Enter your password"}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500">{error}</div>}

          <button
            type="button"
            onClick={handleEmailLogin}
            disabled={loading}
            className="w-full rounded-full bg-blue-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link href="/choose-your-role" className="text-blue-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-3 text-gray-500 font-medium">OR LOGIN WITH</span>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <SocialButton label="Google" icon="https://cdn.iconscout.com/icon/free/png-256/google-160-189824.png" onClick={() => handleSocialLogin("google")} />
          <SocialButton label="GitHub" icon="https://cdn-icons-png.flaticon.com/512/25/25231.png" onClick={() => handleSocialLogin("github")} />
          <SocialButton label="Facebook" icon="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/2048px-2023_Facebook_icon.svg.png" onClick={() => handleSocialLogin("facebook")} />
        </div>
      </div>
    </div>
  );
};

// 🔧 Reusable Inputs
const InputField = ({ label, name, value, onChange, disabled, type = "text", placeholder }) => (
  <div className="space-y-1">
    <label className="block text-sm font-semibold text-gray-700">{label}</label>
    <div className="overflow-hidden rounded-3xl border border-gray-200 px-4 py-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
      <input
        name={name}
        type={type}
        disabled={disabled}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent text-base outline-none text-gray-800"
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

export default LoginPage;
