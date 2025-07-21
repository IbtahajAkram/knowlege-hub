"use client";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth, useClerk, UserButton, useUser } from "@clerk/nextjs";
import { User2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();
  console.log("social Login user email:",user?.primaryEmailAddress?.emailAddress)
  const {signOut} = useClerk()
  const {getToken} = useAuth();
  const router = useRouter();
 const handleLogout = async () => {
  try {
    // Clear traditional login token
    localStorage.clear();

    // Call backend logout for traditional session if it exists
    await axiosInstance.post("/api/auth/logout").catch(() => {}); // ignore if not relevant

    // ✅ Clerk logout (if using Clerk)
    await signOut(); // will redirect to Clerk’s default login or homepage

    // Optional: Manual redirect after logout
    router.push("/login");

    toast.success("Logged out successfully");
  } catch (err) {
    console.error("Logout error:", err);
    toast.error("Logout failed");
  }
};

const handleGetToken = async () => {
    try {
      // const token = await getToken({ template: "skills" }); // 👈 template nam
       const loggedIn = localStorage.getItem("token");
    setIsLoggedIn(loggedIn ? true : false);
        }catch(err){
      console.error("❌ Failed to get token:", err);
        }
      }
  useEffect(() => {
    handleGetToken()
    // const { user } = useUser();
  // console.log("social Login user email:",user?.primaryEmailAddress?.emailAddress)
  }, []);

  return (
    <div>
      <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
        <div className="max-w-6xl mx-4 py-2 px-2">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex space-x-8">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-[#357AFF] rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl font-bold">S</span>
                </div>
                <span className="text-2xl font-bold text-[#0051f3] hover:text-[#357AFF] transition-colors duration-300">
                  SkillNova
                </span>
              </Link>
            </div>
{/* ... */}
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/">Home</Link>
              <Link href="/courses">Courses</Link>
              <Link href="/team-hub/files">Documents</Link>
              <Link href="/video-chat">Video Chat</Link>
              <Link href="/chat">Ai Virtual Assistent</Link>
              <Link href="/team-hub">Team collaboration</Link>
              <Link href="/pricing">Pricing</Link>

              {isLoggedIn == false ? (
                <Link href="/login">Login</Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-blue-700 to-blue-600 text-white px-6 py-2.5 rounded-full hover:bg-[#0c5dff] transition-colors duration-300"
                >
                  Logout
                </button>
              )}
            </div>
            {/* <UserButton/> */}
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden transition-all duration-300 ${
              isMenuOpen ? "max-h-48" : "max-h-0"
            } overflow-hidden`}
          >
            <div className="py-3 space-y-3">
              <Link
                href="/courses"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Courses
              </Link>
              <Link
                href="/about"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Contact
              </Link>
              {!isLoggedIn ? (
                <Link
                  href="/login"
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Login
                </Link>
              ) : (
                <>
                  <User2Icon />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
