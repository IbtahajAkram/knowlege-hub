"use client";

import { CheckCircle } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const features = [
  "Basic MCQs",
  "Limited Access",
  "View‑Only Lessons",
  "Practice Tests",
  "Progress Tracking",
];

export default function CoursePricingPage() {
  const [plans, setPlans] = useState([]);

  const fetchPackages = async () => {
    try {
      const { data } = await axiosInstance.get(
        "/api/checkout_sessions/pakages-details"
      );
      setPlans(data.pricing);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleCheckout = async (plan) => {
    try {
      const { data } = await axiosInstance.post(
        "/api/checkout_sessions/payment",
        {
          pricingId: plan.id,
        },
        { withCredentials: true }
      );
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Stripe session creation failed or URL not returned");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Checkout failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-12 py-20 px-6">
      <h1 className="text-4xl font-bold text-center text-[#246bf8] mb-12">
        Choose Your Plan
      </h1>

      <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="flex flex-col justify-between rounded-xl border border-[#357AFF] shadow-lg p-8 bg-white transition duration-300"
          >
            <div>
              <h2 className="text-2xl font-bold text-[#357AFF] mb-4">
                {plan.planName}
              </h2>
              <p className="text-4xl font-bold text-gray-800 mb-6">
                Rs. {plan.price}
                <span className="text-base text-gray-500">
                  {" "}
                  / {plan.billingCycle}
                </span>
              </p>

              <ul className="space-y-3 mb-6">
                {(plan.price < 900
                  ? ["Basic MCQs", "Limited Access","Practice Tests","Downloadable Notes","Early Access to New Features"]
                  : [
                      "Basic MCQs",
                      "Limited Access",
                      "View‑Only Lessons",
                      "Access to all lessons",
                      "Certificate of Completion",
                      "Progress Tracking",
                    ]
                ).map((feature) => (
                  <li key={feature} className="flex items-center text-gray-700">
                    <CheckCircle className="w-5 h-5 text-[#357AFF] mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => handleCheckout(plan)}
              className="w-full py-3 cursor-pointer text-white bg-[#1765ff] hover:bg-blue-600 rounded-lg font-semibold transition"
            >
              Purchase
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
