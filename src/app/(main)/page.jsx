"use client";

import { useAuth } from "@clerk/nextjs";

export default function GetTokenButton() {
  // const { getToken } = useAuth();

  // const handleGetToken = async () => {
  //   try {
  //     const token = await getToken({ template: "skills" }); // 👈 template name must match
  //     console.log("✅ JWT Token:", token);
  //   } catch (error) {
  //     console.error("❌ Failed to get token:", error);
  //   }
  // };

  return (
    // <div className="p-4 mt-32">
    //   <button
    //     onClick={handleGetToken}
    //     className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
    //   >
    //     Get JWT Token
    //   </button>
    // </div>
    <div className=" font-sans">
  {/* Hero Section */}
  <div className="flex md:h-[704px] flex-col items-center justify-center p-6 md:p-32 text-center">
    <div className="max-w-5xl mx-auto">
      <h1 className="mb-6 text-4xl md:text-6xl font-extrabold text-gray-800">
        Transform Your Future With Our Courses
      </h1>
      <p className="mb-8 text-xl md:text-2xl text-gray-600">
        Access high-quality content taught by industry experts and elevate your career today.
      </p>
      <div className="space-x-4">
        <a
          href="/courses"
          className="inline-block rounded-xl bg-[#357AFF] px-8 py-4 text-lg font-semibold text-white hover:bg-[#2E69DE] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Browse Courses
        </a>
        <a
          href="/signup"
          className="inline-block rounded-xl bg-white px-8 py-4 text-lg font-semibold text-[#357AFF] hover:bg-gray-50 border-2 border-[#357AFF] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Get Started
        </a>
      </div>
    </div>
  </div>

  {/* Features Section */}
  <div className="py-20 bg-white">
    <div className="max-w-7xl hover:-translate-y-4 mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
      {[
        {
          icon: "fas fa-graduation-cap",
          title: "Expert Instructors",
          desc: "Learn from professionals with real-world experience.",
        },
        {
          icon: "fas fa-clock",
          title: "Flexible Learning",
          desc: "Lifetime access, study at your own pace.",
        },
        {
          icon: "fas fa-certificate",
          title: "Get Certified",
          desc: "Earn a certificate after completion to boost your resume.",
        },
      ].map((feature, i) => (
        <div
          key={i}
          className="bg-indigo-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
        >
          <div className="text-[#357AFF] text-4xl mb-4">
            <i className={feature.icon}></i>
          </div>
          <h3 className="text-2xl font-semibold mb-2 text-gray-800">
            {feature.title}
          </h3>
          <p className="text-gray-600">{feature.desc}</p>
        </div>
      ))}
    </div>
  </div>

  {/* Testimonials Section */}
  <div className="py-20 bg-gradient-to-r from-indigo-100 to-blue-100">
    <div className="max-w-5xl mx-auto px-6 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
        What Our Students Say
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            name: "Ayesha K.",
            quote: "The course content was excellent and the instructors were amazing!",
          },
          {
            name: "Zain M.",
            quote: "Flexible timing and lifetime access made learning easy and fun.",
          },
          {
            name: "Sara A.",
            quote: "I got a certificate that helped me land a better job. Highly recommend!",
          },
        ].map((testi, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300"
          >
            <p className="text-gray-600 italic mb-4">"{testi.quote}"</p>
            <h4 className="text-lg font-semibold text-[#357AFF]">{testi.name}</h4>
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* Final CTA Section */}
  <div className="py-16 bg-white text-center">
    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
      Ready to Take the Next Step?
    </h2>
    <p className="text-lg text-gray-600 mb-8">
      Join thousands of learners today and start building your future.
    </p>
    <a
      href="/signup"
      className="inline-block bg-[#357AFF] text-white text-lg font-semibold px-8 py-4 rounded-xl hover:bg-[#2E69DE] shadow-md transition-all duration-300"
    >
      Join Now
    </a>
  </div>
</div>

  );
}


