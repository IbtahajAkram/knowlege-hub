"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { BookUser, MessageCircle, PhoneCall } from "lucide-react";
import Link from "next/link";
import LoadingAnimations from "../../LoadingAnimations";
const CourseDetailPage = () => {
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("PENDING");
  const params = useParams();
  const courseId = params?.id;
  const [loading, setLoading] = useState(true);
  const [ShowLoadingAnimations, setShowLoadingAnimations] = useState(true);
  console.log(paymentStatus, "paymentStatus");

  const handleFetchCourseDetail = async () => {
    try {
      const res = await axiosInstance.get(`/api/courses/${courseId}`);
      setCourse(res.data?.course);
      setPaymentStatus(
        res.data?.userData?.paymentStatus || "PENDING"
      );
      // console.log("ssss", res.data?.course);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchCourseDetail();
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setShowLoadingAnimations(false);
    }, 3000); // Simulate a loading delay of 1 second
  }, []);

  return (
    <>
      {ShowLoadingAnimations ? (
        <div className="h-38">
          <LoadingAnimations />
        </div>
      ) : (
        <div className="max-w-[1280px] mt-30 mx-auto mt-10 px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
          {/* Left Section */}
          <div className="md:col-span-2 space-y-4">
            {course?.image && (
              <img
                src={course.image}
                alt={course.title}
                className="w-full border border-gray-200 h-[444px] object-contain rounded-xl shadow-md  hover:shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.02] cursor-pointer"
              />
            )}

            {/* Course Info */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
              <h1 className="text-3xl font-extrabold text-[#002f34] tracking-tight mb-2">
                🎓 {course?.title}
              </h1>

              {/* <p className="text-2xl font-semibold text-green-700 mb-4">
    💰 Rs. {course?.price || 3999}
  </p> */}

              <h2 className="text-2xl mt-6 font-bold text-[#002f34] mb-4">
                📝 Course Description:
              </h2>

              <p className="text-gray-700 leading-relaxed text-[16px]">
                {course?.description}
              </p>
              <div className="mt-10 bg-white p-6 rounded-xl border border-gray-200 shadow">
                <h2 className="text-2xl font-bold text-[#002f34] mb-4">
                  🎯 Who Should Join?
                </h2>
                <p className="text-gray-700 text-[16px]">
                  This course is perfect for:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 mt-2">
                  <li>Beginners looking to build a solid foundation</li>
                  <li>Students wanting to enhance their skillset</li>
                  <li>Freelancers aiming to expand their services</li>
                  <li>Anyone switching careers into tech/design/marketing</li>
                </ul>
              </div>
              <div className="mt-10 bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-100">
                <h2 className="text-2xl font-bold text-[#002f34] mb-4">
                  💡 Why Take This Course?
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-[16px]">
                  <li>Learn at your own pace with flexible access</li>
                  <li>Hands-on assignments and real-world projects</li>
                  <li>Guidance from industry experts</li>
                  <li>Get a certificate to boost your resume</li>
                  <li>Affordable and value-packed content</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="space-y-6">
            {/* Instructor Info */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
              <h1 className="text-3xl font-extrabold text-[#002f34] tracking-tight mb-2">
                🎓 {course?.title}
              </h1>

              <h2 className="text-2xl mt-6 font-bold text-[#002f34] mb-4">
                📝 Course Description:
              </h2>

              <p className="text-gray-700 leading-relaxed text-[16px] mb-6">
                {course?.description}
              </p>

              {/* 🔹 Static Details Below */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-[#002f34] text-sm md:text-base">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⏱</span>
                  <span>
                    <strong>Duration:</strong> 4 Weeks (Self-paced)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🧑‍🏫</span>
                  <span>
                    <strong>Instructor:</strong> Expert in the Field
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌐</span>
                  <span>
                    <strong>Language:</strong> English & Urdu
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📱</span>
                  <span>
                    <strong>Access:</strong> Lifetime Access on All Devices
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📜</span>
                  <span>
                    <strong>Certificate:</strong> Yes, with Completion
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎯</span>
                  <span>
                    <strong>Level:</strong> Beginner to Intermediate
                  </span>
                </div>
              </div>
              <Link href={`${paymentStatus === "PENDING" ? "/pricing" : `/courses/lecture/${course.id}`}`}>
              <button
                className="px-6 w-full mt-6 cursor-pointer animate-bounce py-2 rounded-full bg-gradient-to-r from-blue-700 to-blue-600 
                  font-medium hover:shadow-lg text-white transform hover:-translate-y-1 transition-all duration-200 
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                <span className="text-lg font-semibold"><BookUser className="w-5 h-5 mt-1"/></span>
                <span className="text-lg font-semibold">{`${paymentStatus === "PENDING" ? "Enroll Now":"Watch Now"}`}</span>
              </button>
              </Link>
              {/* Optional: List of What You'll Learn */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-2">
                  📦 What You’ll Learn:
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm md:text-base">
                  <li>Fundamentals and core concepts</li>
                  <li>Hands-on projects to practice skills</li>
                  <li>Real-world examples and case studies</li>
                  <li>Tips & tricks from industry experts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseDetailPage;
