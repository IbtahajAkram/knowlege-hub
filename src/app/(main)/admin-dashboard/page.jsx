"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../../utils/axiosInstance";
const page = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState(null);
  const [PricingData, setPricingData] = useState({
    price: "",
    pakageName: "",
    currency: "",
    billingCycle: "",
  });
  console.log("dataaa", PricingData);
  const hanldeInputChange = (e) => {
    const { name, value } = e.target;
    setPricingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [loading, setLoading] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);

  const hanldeCreatePricingPlan = async () => {
    try {
      await axiosInstance
        .post("/api/checkout_sessions/create-pricing-plan", PricingData)
        .then((res) => {
          toast.success(res.data.message);
          setShowPricingModal(!showPricingModal);
          setPricingData("");
        });
    } catch (error) {
      toast.error(error.message || response.error.data.message);
    }
  };
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  // if (!currentUser?.roles?.includes('admin')) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
  //       <div className="rounded-lg bg-white p-8 shadow-xl">
  //         <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
  //         <p className="mt-2 text-gray-600">You must be an admin to view this page.</p>
  //         <a href="/" className="mt-4 inline-block rounded-lg bg-[#357AFF] px-4 py-2 text-white hover:bg-[#2E69DE]">
  //           Return Home
  //         </a>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-500">
            {error}
          </div>
        )}
        <div className="flex justify-end items-end mb-4 ">
          <button
            onClick={() => setShowPricingModal(!showPricingModal)}
            className="bg-gradient-to-r mb-6 mt-6 from-blue-700 to-blue-600 text-white px-6 py-3 rounded-full 
                font-semibold shadow-lg cursor-pointer hover:shadow-xl transform hover:-translate-y-1 stransition-all duration-200 
                flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Pricing Plan
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Courses Overview
            </h2>
            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <h3 className="font-bold text-gray-800">{course.title}</h3>
                  <p className="text-sm text-gray-600">
                    Instructor: {course.instructor_name}
                  </p>
                  <p className="mt-2 text-gray-600">{course.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-800">User Roles</h2>
            <div className="space-y-4">
              {users?.map((user) => (
                <div
                  key={user.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <p className="font-bold text-gray-800">{user.email}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {roles.map((role) => (
                      <button
                        key={role.id}
                        onClick={() => handleRoleChange(user.id, role.id)}
                        className={`rounded-full px-3 py-1 text-sm ${
                          user.roles?.includes(role.name)
                            ? "bg-[#357AFF] text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {role.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {showPricingModal && (
            <div className="fixed inset-0 bg-black/5 z-[100] flex justify-center items-center px-4">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-fade-in-up">
                {/* Close Button */}
                <button
                  onClick={() => setShowPricingModal(false)}
                  className="absolute top-4 right-4 text-gray-500 text-xl cursor-pointer hover:text-red-500 transition duration-300"
                >
                  ✕
                </button>

                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                  Create Pricing Plan
                </h2>

                <div className="space-y-4">
                  <input
                    onChange={hanldeInputChange}
                    value={PricingData.pakageName}
                    name="pakageName"
                    type="text"
                    placeholder="Plan Name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <input
                    onChange={hanldeInputChange}
                    value={PricingData.price}
                    name="price"
                    type="number"
                    placeholder="Price"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <input
                    onChange={hanldeInputChange}
                    value={PricingData.currency}
                    name="currency"
                    type="text"
                    placeholder="Currency"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <input
                    onChange={hanldeInputChange}
                    value={PricingData.billingCycle}
                    name="billingCycle"
                    type="text"
                    placeholder="Billing Cycle"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                <div className="flex items-center text-center justify-center">
                  <button
                    onClick={hanldeCreatePricingPlan}
                    className="bg-gradient-to-r mb-6 mt-6 from-blue-700 to-blue-800 text-white px-6 py-3 rounded-full 
                font-semibold shadow-lg  w-full cursor-pointer hover:shadow-xl transform hover:-translate-y-1 duration-300
                 gap-2"
                  >
                    Create Plan
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
