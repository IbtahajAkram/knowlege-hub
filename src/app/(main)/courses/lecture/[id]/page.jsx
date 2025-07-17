"use client";

import React, { useEffect, useState } from "react";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";
import axiosInstance from "@/utils/axiosInstance";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { BookUser, CheckCircle, PlayCircle } from "lucide-react";

export default function LightThemeCoursePlayer() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videoList, setVideoList] = useState([]);
  console.log(videoList, "aaaaaa");
  const [courseData, setCourseData] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    axiosInstance
      .get(`/api/courses/${id}`)
      .then((res) => {
        const course = res.data.course;
        console.log(course, "✅ course data");

        let parsedVideos = [];

        try {
          // If 'video' is already an array of URLs or objects, skip parsing
          if (Array.isArray(course?.video)) {
            parsedVideos = course.video;
          } else if (typeof course?.video === "string") {
            parsedVideos = JSON.parse(course.video);
          }
        } catch (err) {
          console.error("❌ Failed to parse course.video", err);
        }

        setVideoList(parsedVideos);
        setCourseData(course);
      })
      .catch((err) => {
        console.error("❌ Error fetching course", err);
        toast.error(err?.response?.data?.message || err?.message);
      });
  }, [id]);

  const currentVideo = videoList[currentVideoIndex];

  return (
    <div className="min-h-screen mt-24 bg-gradient-to-b from-[#e6e4ff] to-[#f5f7ff] text-gray-800 py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
          <h2 className="text-2xl flex gap-2 font-extrabold text-blue-600 mb-6 text-center">
            <BookUser className="mt-1" /> Course Modules
          </h2>
          <ul className="space-y-4">
            {videoList.map((video, index) => (
              <li
                key={index}
                onClick={() => setCurrentVideoIndex(index)}
                className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer border transition-all duration-200 ${
                  index === currentVideoIndex
                    ? "bg-blue-600 text-gray-200 border-blue-600 shadow-lg"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-[#f0f3ff]"
                }`}
              >
                <div className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full shadow-inner">
                  {index === currentVideoIndex ? (
                    <PlayCircle className="text-gray-600" size={20} />
                  ) : index < currentVideoIndex ? (
                    <CheckCircle size={20} className="text-green-500" />
                  ) : (
                    <span className="text-sm font-semibold text-blue-600">
                      {index + 1}
                    </span>
                  )}
                </div>
                <span className="font-medium">Module {index + 1}</span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Video Content */}
        <main className="flex-1 space-y-8">
          {currentVideo ? (
            <>
              <div className="overflow-hidden  rounded-2xl border border-gray-300 shadow-xl">
                <Plyr
                  source={{
                    type: "video",
                    sources: [
                      {
                        src: currentVideo,
                        provider: "html5",
                      },
                    ],
                  }}
                  options={{
                    controls: [
                      "play",
                      "rewind",
                      "fast-forward",
                      "progress",
                      "current-time",
                      "duration",
                      "mute",
                      "volume",
                      "captions",
                      "settings",
                      "pip",
                      "airplay",
                      "fullscreen",
                    ],
                    settings: ["captions", "quality", "speed"],
                    speed: { selected: 1, options: [0.5, 1, 1.5, 2] },
                    quality: { default: 1080, options: [1080, 720, 480] },
                  }}
                />
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200">
                <h1 className="text-3xl font-bold text-blue-700 mb-3">
                  {courseData?.title}
                </h1>
                <p className="text-gray-700 text-base leading-relaxed">
                  {courseData?.description}
                </p>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-600 text-lg">
              No video available.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
