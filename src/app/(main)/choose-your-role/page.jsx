import Link from "next/link";
import React from "react";
const page = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 ">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 py-14 shadow-xl">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
          Choose your Role
        </h1>
        <div className="flex gap-6">
          <button className="w-full rounded-lg bg-[#357AFF] px-4 py-3 text-base font-medium text-white transition-colors hover:bg-[#2E69DE] focus:outline-none focus:ring-2 focus:ring-[#357AFF] focus:ring-offset-2 disabled:opacity-50">
            <Link href="/student/signup">
            Student
            </Link>
          </button>
          <button className="w-full rounded-lg bg-[#357AFF] px-4 py-3 text-base font-medium text-white transition-colors hover:bg-[#2E69DE] focus:outline-none focus:ring-2 focus:ring-[#357AFF] focus:ring-offset-2 disabled:opacity-50">
            <Link href="/instructor-808/signup">
            Instructor{" "}
          </Link>
          </button>
        </div>
      </div>
    </div>
  );
};
export default page;
