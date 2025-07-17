"use client"
import React, { useState } from "react";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showEdit, setShowEdit] = useState(false);

  const user = {
    name: "Muhammad Zawwar",
    email: "zawwar1313@gmail.com",
    role: "Student",
    profilePic: "https://i.pravatar.cc/150?img=3",
    enrolledCourses: 8,
    completedCourses: 5,
    inProgressCourses: 3,
    certificates: 2,
  };

  const courses = [
    { title: "React for Beginners", progress: 100 },
    { title: "Node.js Essentials", progress: 70 },
    { title: "TailwindCSS Mastery", progress: 45 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-30 px-4">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={user.profilePic}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-blue-500"
          />
          <div className="text-center mt-3 sm:text-left">
            <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 text-sm rounded-full mt-2">
              {user.role}
            </span>
          </div>
          <div className="ml-auto mt-4 sm:mt-0">
            <button
              onClick={() => setShowEdit(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 cursor-pointer rounded-lg transition"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 border-b border-gray-200">
          {["overview", "my-courses", "settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500"
              } transition`}
            >
              {tab === "overview"
                ? "Overview"
                : tab === "my-courses"
                ? "My Courses"
                : "Settings"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6">
     {activeTab === "overview" && (
  <div className="mt-6">
    {/* Stats */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
      <div className="bg-gray-100 rounded-lg p-4 py-6 duration-100 hover:scale-[1.05] cursor-pointer">
        <p className="text-xl font-semibold text-blue-600">
          {user.enrolledCourses}
        </p>
        <p className="text-base  text-gray-600">Enrolled</p>
      </div>
      <div className="bg-gray-100 duration-100 hover:scale-[1.05] cursor-pointer rounded-lg p-4">
        <p className="text-xl font-semibold text-green-600">
          {user.completedCourses}
        </p>
        <p className="text-base  text-gray-600">Completed</p>
      </div>
      <div className="bg-gray-100 duration-100 hover:scale-[1.05] cursor-pointer rounded-lg p-4">
        <p className="text-xl font-semibold text-yellow-600">
          {user.inProgressCourses}
        </p>
        <p className="text-base  text-gray-600">In Progress</p>
      </div>
      <div className="bg-gray-100 duration-100 hover:scale-[1.05] cursor-pointer rounded-lg p-4">
        <p className="text-xl font-semibold text-red-600">
          {user.certificates}
        </p>
        <p className="text-base  text-gray-600">Certificates</p>
      </div>
    </div>

    {/* Activity Timeline */}
    <div className="mt-10">
      <h3 className="text-xl font-semibold text-blue-600 mb-4">Recent Activity</h3>
      <ul className="space-y-4">
        {[
          {
            icon: "📥",
            action: "Enrolled in",
            target: "Advanced JavaScript",
            time: "2 hours ago",
          },
          {
            icon: "🏁",
            action: "Completed",
            target: "React for Beginners",
            time: "1 day ago",
          },
          {
            icon: "📄",
            action: "Downloaded certificate for",
            target: "Node.js Essentials",
            time: "3 days ago",
          },
          {
            icon: "✏️",
            action: "Updated profile picture",
            target: "",
            time: "5 days ago",
          },
        ].map((activity, i) => (
          <li key={i} className="bg-white hover:-translate-y-2 hover:transition-all duration-500 border border-gray-200 rounded-md px-4 py-6 cursor-pointer shadow-sm">
            <div className="flex items-start  gap-3">
              <div className="text-2xl">{activity.icon}</div>
              <div>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">{activity.action}</span>{" "}
                  <span className="text-blue-600">{activity.target}</span>
                </p>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
)}


          {activeTab === "my-courses" && (
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Enrolled Courses
              </h3>
              <ul className="space-y-4">
                {courses.map((course, idx) => (
                 <li
  key={idx}
  className="bg-gray-50 p-4 py-6 cursor-pointer rounded-lg shadow-sm border border-gray-300
             hover:shadow-lg hover:bg-white hover:border-blue-400 hover:scale-[1.03] transition-all duration-500 ease-in-out"
>
  <div className="flex justify-between items-center">
    <p className="font-medium mb-4 text-gray-700">{course.title}</p>
    <span className="text-sm text-blue-600">{course.progress}% completed</span>
  </div>
  <div className="w-full bg-gray-200 h-2 mt-2 rounded-full">
    <div
      className="bg-blue-500 h-2 rounded-full"
      style={{ width: `${course.progress}%` }}
    ></div>
  </div>
</li>

                ))}
              </ul>
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Account Settings
              </h3>
              <p className="text-gray-600">Password, notifications, privacy...</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/10 bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Edit Profile
            </h3>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full mb-3 px-4 py-2.5 border border-gray-300 rounded"
              defaultValue={user.name}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-3 px-4 py-2.5 border border-gray-300 rounded"
              defaultValue={user.email}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setShowEdit(false)}
              >
                Cancel
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
