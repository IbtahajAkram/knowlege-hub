"use client";
import { useEffect, useRef, useState } from "react";
import { Edit, Trash } from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../../../utils/axiosInstance";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, useSignIn, useUser } from "@clerk/nextjs";
import axios from "axios";
const page = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  console.log(selectedCourse, "selectedCourse");
  const [upload, setUpload] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const router = useRouter();
  const [role, setRole] = useState("");
  console.log(role, "role");
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const videoInputRef = useRef(null);
  const [showUplaodLoading, setshowUplaodLoading] = useState(false);
  const { signIn, isLoaded } = useSignIn();
  // const { isSignedIn, user } = useUser();
  //     const { getToken, userId } = useAuth();
  //   useEffect(async() => {

  //     const token = await getToken({ template: "tokens" });
  //          console.log("📢 JWT Token:", token,userId);
  //   }, [])

  // useEffect(() => {
  //   const saveData = async () => {
  //     if (!isSignedIn || !user) return;

  //     try {
  //       const token = await getToken({ template: "tokens" });
  //       console.log("📢 JWT Token:", token);

  //       const userData = {
  //         id: user.id,
  //         name: user.fullName,
  //         email: user.primaryEmailAddress?.emailAddress,
  //         token: token || null,
  //       };

  //       localStorage.setItem("skillhub_user", JSON.stringify(userData));
  //     } catch (error) {
  //       console.error("❌ Error getting token:", error);
  //     }
  //   };

  //   saveData();
  // }, [isSignedIn, user]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    video: [], // ⬅️ اب raw file رکھیں، videoUrl کی ضرورت نہیں
  });

  console.log(formData, "formData");

  const fetchAllCourses = () => {
    axiosInstance
      .get(activeTab === "all" ? "/api/courses" : `/api/courses/own`)
      .then((res) => {
        const fetchCourses =
          activeTab === "all" ? res?.data?.courses : res?.data?.filtersCourses;
        setCourses(fetchCourses);
        setRole(res?.data?.userRole);
        // console.log("sss",res?.data?.userRole);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || err?.message);
      });
  };

  useEffect(() => {
    fetchAllCourses();
  }, [activeTab]);

  const hanldeImageUpload = (file) => {
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  // const handleVideo = (file) => {
  //   const fd = new FormData();
  //   fd.append("file", file);
  //   fd.append("upload_preset", "unsignedPreset"); // ← Cloudinary preset

  //   const xhr = new XMLHttpRequest();
  //   xhr.open("POST", "https://api.cloudinary.com/v1_1/<cloud>/video/upload");

  //   xhr.upload.onprogress = (e) =>
  //     setProgress(Math.round((e.loaded * 100) / e.total));

  //   xhr.onload = () => {
  //     const url = JSON.parse(xhr.response).secure_url;
  //     setFormData((p) => ({ ...p, video: url }));
  //     setProgress(0);
  //   };

  //   xhr.onerror = () => {
  //     toast.error("Video upload failed");
  //     setProgress(0);
  //   };

  //   xhr.send(fd);
  // };

  // const handleCreateCourse = () => {
  //   const form_Data = new FormData();
  //   form_Data.append("title", formData.title);
  //   form_Data.append("description", formData.description);
  //   form_Data.append("image", formData.image);
  //   axiosInstance
  //     .post("/api/courses", form_Data)
  //     .then((res) => {
  //       setIsAddModalOpen(false);
  //       setFormData({
  //         title: "",
  //         description: "",
  //         image: null,
  //       });
  //       fetchAllCourses();
  //       toast.success(res?.data?.message);
  //     })
  //     .catch((err) => {
  //       setError(err?.response?.data?.message || err?.message);
  //       toast.error(err?.response?.data?.message || err?.message);
  //       if (err.status === 401) {
  //         toast.error(
  //           "You are not authorized to perform this action. Please login."
  //         );
  //         router.push("/login");
  //         return;
  //       }
  //     });
  // };
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && name === "video") {
      setFormData((prev) => ({
        ...prev,
        video: Array.from(files), // ✅ Save as array
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: files ? files[0] : value,
      }));
    }
  };
  // const handleCreateCourse = async () => {
  //   if (
  //     !formData.title ||
  //     !formData.description ||
  //     !formData.image ||
  //     !formData.video ||
  //     formData.video.length === 0
  //   ) {
  //     toast.error("All fields are required");
  //     return;
  //   }

  //   try {
  //     setIsUploading(true);
  //     const fd = new FormData();

  //     fd.append("title", formData.title);
  //     fd.append("description", formData.description);
  //     fd.append("image", formData.image);

  //     formData.video.forEach((videoFile) => {
  //       fd.append("video", videoFile); // ✅ Multer field name should be `video`
  //     });

  //     setUpload(true);

  //     const response = await axiosInstance.post("/api/courses", fd, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //       onUploadProgress: ({ loaded, total }) => {
  //         if (total) {
  //           setProgress(Math.round((loaded * 100) / total));
  //         }
  //       },
  //       timeout: 0,
  //     });

  //     toast.success(response?.data?.message || "Course created!");
  //     setIsAddModalOpen(false);
  //     setFormData({
  //       title: "",
  //       description: "",
  //       image: null,
  //       video: [], // ✅ set to array not null
  //     });
  //     setUpload(false);
  //     if (videoInputRef.current) videoInputRef.current.value = ""; // ✅ reset input
  //     setProgress(0);
  //     setProgress("")
  //     fetchAllCourses();
  //   } catch (err) {
  //     toast.error(err?.response?.data?.message || err.message);
  //   }
  // };


   // const handleCreateCourse = async () => {
  //   const { title, description, image, video } = formData;

  //   if (!title || !description || !image || video.length === 0) {
  //     toast.error("All fields are required");
  //     return;
  //   }

  //   try {
  //     setIsUploading(true);
  //     setUpload(true);

  //     const imageUrl = await uploadFileToCloudinary(image, "image");
  //     const videoUrls = [];
  //     for (let i = 0; i < video.length; i++) {
  //       const url = await uploadFileToCloudinary(video[i], "video");
  //       videoUrls.push(url);
  //     }

  //     const payload = { title, description, image: imageUrl, videoUrls };
  //     const res = await axiosInstance.post("/api/courses", payload);

  //     toast.success(res.data.message || "Course created!");
  //     setFormData({ title: "", description: "", image: null, video: [] });
  //     if (videoInputRef.current) videoInputRef.current.value = "";
  //     setIsAddModalOpen(false);
  //     fetchCourses();
  //   } catch (err) {
  //     toast.error(err.response?.data?.message || err.message);
  //   } finally {
  //     setIsUploading(false);
  //     setUpload(false);
  //     setProgress(0);
  //   }
  // };

  //     const handleCreateCourse = async () => {
  //   const { title, description, image, video } = formData;

  //   if (!title || !description || !image || video.length === 0) {
  //     toast.error("All fields are required");
  //     return;
  //   }

  //   try {
  //     setIsUploading(true);
  //     setUpload(true);

  //     // 🔁 Upload image first
  //     const imageUrl = await uploadFileToCloudinary(image, "image");

  //     // 🔁 Upload all videos in parallel
  //     const videoUploadPromises = video.map((vid) =>
  //       uploadFileToCloudinary(vid, "video")
  //     );

  //     const videoUrls = await Promise.all(videoUploadPromises); // ⏱️ all uploads at once

  //     // 📨 Send to server
  //     const payload = { title, description, image: imageUrl, videoUrls };
  //     const res = await axiosInstance.post("/api/courses", payload);

  //     toast.success(res.data.message || "Course created!");
  //     setFormData({ title: "", description: "", image: null, video: [] });
  //     if (videoInputRef.current) videoInputRef.current.value = "";
  //     setIsAddModalOpen(false);
  //     fetchCourses();
  //   } catch (err) {
  //     toast.error(err.response?.data?.message || err.message);
  //   } finally {
  //     setIsUploading(false);
  //     setUpload(false);
  //     setProgress(0);
  //   }
  // };

  const uploadFileToCloudinary = async (file, resourceType = "video") => {
    const { data } = await axiosInstance.get("/signature");
    const form = new FormData();
    form.append("file", file);
    form.append("api_key", data.apiKey);
    form.append("timestamp", data.timestamp);
    form.append("signature", data.signature);
    form.append("upload_preset", data.uploadPreset);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${data.cloudName}/${resourceType}/upload`,
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: ({ loaded, total }) => {
          if (total) {
            setProgress((prevProgress) => {
              const next = Math.min(Math.round((loaded * 100) / total), 100);
              return next;
            });
          }
        },
      }
    );

    return res.data.secure_url;
  };

  const handleCreateCourse = async () => {
    setshowUplaodLoading(true);
    const { title, description, image, video } = formData;

    if (!title || !description || !image || video.length === 0) {
      toast.error("All fields are required");
      return;
    }

    try {
      setIsUploading(true);
      setUpload(true);

      // 1️⃣ Upload image
      const imageUrl = await uploadFileToCloudinary(image, "image");

      // 2️⃣ Upload videos in parallel (best way)
      const videoUploadPromises = video.map((vid) =>
        uploadFileToCloudinary(vid, "video").then(
          (url) => ({ status: "fulfilled", url }),
          (error) => ({ status: "rejected", error })
        )
      );

      const videoResults = await Promise.all(videoUploadPromises);
      const successfulVideos = videoResults
        .filter((r) => r.status === "fulfilled")
        .map((r) => r.url);

      const failedUploads = videoResults.filter((r) => r.status === "rejected");

      if (successfulVideos.length === 0) {
        toast.error("All video uploads failed.");
        return;
      }

      // 3️⃣ Send to backend
      const payload = {
        title,
        description,
        image: imageUrl,
        videoUrls: successfulVideos,
      };

      const res = await axiosInstance.post("/api/courses", payload);
      setshowUplaodLoading(false);
      toast.success(res.data.message || "Course created!");
      setFormData({ title: "", description: "", image: null, video: [] });
      if (videoInputRef.current) videoInputRef.current.value = "";
      setIsAddModalOpen(false);
      fetchAllCourses();

      // Notify if some uploads failed
      if (failedUploads.length > 0) {
        toast.warn(`${failedUploads.length} video(s) failed to upload.`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setIsUploading(false);
      setUpload(false);
      setProgress(0);
    }
  };

  const handleEditCourse = () => {
    const EditFormData = new FormData();
    EditFormData.append("title", formData.title);
    EditFormData.append("description", formData.description);

    if (formData.image instanceof File) {
      EditFormData.append("image", formData.image);
    }

    formData.video?.forEach((videoFile) => {
      if (videoFile instanceof File) {
        EditFormData.append("video", videoFile);
      }
    });

    setUpload(true);
    const courseId = selectedCourse?.id || selectedCourse?.courseId;
    axiosInstance
      .put(`/api/courses/${courseId}`, EditFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setIsEditModalOpen(false);
        fetchAllCourses();
        setFormData({ title: "", description: "", image: null, video: [] });
        setUpload(false);
        toast.success(res?.data?.message);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || err?.message);
        toast.error(err?.response?.data?.message || err?.message);
        setUpload(false);
      });
  };

  const handleDelete = (id) => {
    axiosInstance
      .delete(`api/courses/${id}`)
      .then((res) => {
        fetchAllCourses();
        toast.success(res?.data?.message);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || err?.message);
        if (err.status === 401) {
          router.push("/login");
          return;
        }
      });
  };

  const hanldeEdit = (course) => {
    console.log(course, "course");
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      image: course.image,
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="h-screen  py-4 px-6">
      <div className="max-w-7xl  mt-20 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          {/* Tabs */}
          <div className="flex space-x-4 bg-gray-100 p-2 rounded-full shadow-inner">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-5 py-2 rounded-full cursor-pointer  font-medium transition-all duration-200 ${
                activeTab === "all"
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-600 hover:bg-blue-100"
              }`}
            >
              All Courses
            </button>
            {role !== "STUDENT" && (
              <button
                onClick={() => setActiveTab("own")}
                className={`px-5 py-2 rounded-full  cursor-pointer font-medium transition-all duration-200 ${
                  activeTab === "own"
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-600 hover:bg-blue-100"
                }`}
              >
                Your Courses
              </button>
            )}
          </div>
          {/* Add Course Button */}
          <div>
            {role !== "STUDENT" && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-gradient-to-r from-blue-700 to-blue-600 text-white px-6 py-3 rounded-full 
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
                Add New Course
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-5 mb-6 rounded-lg shadow">
            <div className="flex items-center">
              <svg
                className="h-6 w-6 text-red-500 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          </div>
        )}

        <div className="flex h-[655px] flex-wrap justify-center items-center gap-8 max-w-7xl mx-auto p-4">
          {courses?.length !== 0 ? null : (
            <div className="text-center -mt-42 px-14 py-16 bg-gray-100 rounded-xl shadow-md">
              <div className="text-4xl mb-4">📚</div>
              <h2 className="text-xl font-semibold text-gray-800">
                No Courses Found
              </h2>
              <p className="text-gray-600 mt-2">
                Try creating or exploring new courses.
              </p>
            </div>
          )}
          {courses?.map((course, index) => (
            <div
              key={index}
              className="bg-white/70 h-[480px] cursor-pointer backdrop-blur-sm border border-gray-200 shadow-md overflow-hidden hover:shadow-xl transform hover:-translate-y-2 transition duration-300 flex flex-col w-full max-w-xs"
            >
              {/* Image Section with floating buttons */}
              <div className="relative h-56 -mt-1 pt-0">
                <img
                  src={course?.image} // ✅ full path
                  alt={course?.title}
                  className="w-full h-full top-0 object-cover  hover:scale-105 transition-transform duration-500"
                />

                {/* Floating action buttons */}
                <div className="absolute top-4 right-3 flex gap-2 z-10">
                  {/* Edit and Delete Buttons */}
                  {role !== "STUDENT" ? (
                    <>
                      <button
                        className="group relative text-white bg-green-500 p-2 rounded-lg shadow-md transition duration-300 hover:bg-green-600 hover:scale-105 hover:shadow-lg"
                        onClick={() => hanldeEdit(course)}
                      >
                        <Edit size={16} />
                        <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-black text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none">
                          Edit
                        </span>
                      </button>

                      <button
                        onClick={() => handleDelete(course?.id)}
                        className="group relative text-white bg-red-500 p-2 rounded-lg shadow-md transition duration-300 hover:bg-red-600 hover:scale-105 hover:shadow-lg"
                        title="Delete"
                      >
                        <Trash size={16} />
                        <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-black text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none">
                          Delete
                        </span>
                      </button>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              {/* Course Content */}
              <div className="flex flex-col justify-between flex-grow pb-4 p-5">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {course?.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-4">
                    {course?.description}
                  </p>
                </div>
                <div>
                  <Link
                    href={`/courses/${course?.id}`}
                    className="w-full flex justify-center items-center"
                  >
                    <button className="bg-gradient-to-r w-full from-blue-800 to-blue-600 text-transparent cursor-pointer text-white py-2.5 hover:rounded-md">
                      View Course
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-[560px] h-[620px] shadow-2xl transform transition-all flex flex-col justify-between overflow-y-auto">
              {" "}
              {showUplaodLoading && (
                <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 rounded-full border-[6px] border-blue-500 border-dashed animate-spin "></div>
                    <div className="absolute inset-3 rounded-full bg-white flex items-center justify-center shadow-lg">
                      <span className="text-sm font-semibold text-blue-600 animate-pulse">
                        Uploading...
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
                Add New Course
              </h2>
              {/* Title Input */}
              <input
                type="text"
                placeholder="Course Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 p-3 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* Description Input */}
              <div className="h-[84px] mb-16">
                <textarea
                  placeholder="Course Description"
                  name="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                  className="w-full h-[144px] border border-gray-300 p-3 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                />
              </div>
              {/* Image Upload */}
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Course Thumbnail Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => hanldeImageUpload(e.target.files[0])}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full 
            file:border-0 file:font-semibold file:bg-purple-100 file:text-purple-800
            hover:file:bg-purple-200"
                />
                {formData.image && (
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Preview"
                    className="mt-4 mb-2 max-h-48 w-full rounded-lg object-cover shadow"
                  />
                )}
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Course Intro Video
                </label>
                <input
                  type="file"
                  name="video"
                  multiple
                  accept="video/*"
                  ref={videoInputRef}
                  onChange={handleChange}
                  className="w-full text-sm text-gray-500 file:mr-4
                   file:py-2 file:px-4 file:rounded-full file:border-0
                   file:font-semibold file:bg-blue-100 file:text-blue-800
                   hover:file:bg-blue-200"
                />
                {isUploading && (
                  <div className="w-full mt-8">
                    <p className="mb-1 text-sm font-medium text-gray-700">
                      Uploading Video...
                    </p>
                    <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-500 h-3 transition-all duration-300 ease-in-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{progress}%</p>
                  </div>
                )}
                {formData.video.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Array.isArray(formData.video) &&
                      formData.video.map((vid, i) => (
                        <video
                          key={i}
                          controls
                          src={URL.createObjectURL(vid)}
                          className="mt-4 max-h-48 w-full rounded-lg"
                        />
                      ))}
                  </div>
                )}
              </div>
              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setFormData({
                      title: "",
                      description: "",
                      image: "",
                      video: "",
                    });
                  }}
                  className="px-6 py-2 rounded-full bg-gray-200 text-black font-medium hover:bg-gray-300 
            transform hover:-translate-y-1 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCourse}
                  disabled={isUploading}
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white 
                  font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {upload ? "Uploading..." : "Add Course"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            {" "}
            <div className="bg-white rounded-2xl p-8 w-full max-w-[500px] h-[500px] shadow-2xl transform transition-all flex flex-col justify-between overflow-y-auto">
              {" "}
              <h2 className="text-3xl font-bold mb-6 text-gray-800">
                {" "}
                Edit Course{" "}
              </h2>{" "}
              <input
                type="text"
                placeholder="Course Name"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full border border-gray-300 p-3 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />{" "}
              <textarea
                placeholder="Course Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 p-3 rounded-xl mb-4 resize-none h-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />{" "}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => hanldeImageUpload(e.target.files[0])}
                className="mb-4 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full 
                  file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-blue-700
                  hover:file:bg-purple-100 "
              />{" "}
              {/* Show preview if image is URL or file */}{" "}
              {formData.image && (
                <img
                  src={
                    formData.image instanceof File
                      ? URL.createObjectURL(formData.image)
                      : formData.image
                  }
                  alt="Preview"
                  className="mb-4 max-h-48 w-full rounded-lg object-cover"
                />
              )}{" "}
              <input
                type="file"
                name="video"
                multiple
                accept="video/*"
                onChange={handleChange}
              />
              <div className="flex justify-between">
                {" "}
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setFormData({ title: "", description: "", image: null });
                  }}
                  className="bg-gray-300 px-5 py-2 rounded-full font-semibold hover:bg-gray-400"
                >
                  {" "}
                  Cancel{" "}
                </button>{" "}
                <button
                  onClick={handleEditCourse}
                  className="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-700 disabled:opacity-50"
                  disabled={upload}
                >
                  {" "}
                  Update{" "}
                </button>{" "}
              </div>{" "}
            </div>{" "}
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
