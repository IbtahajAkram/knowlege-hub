
"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import axiosInstance from "../../../utils/axiosInstance";
import { toast } from "react-toastify";

const Page = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    video: [],
  });

  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const videoInputRef = useRef(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [upload, setUpload] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axiosInstance.get("/api/courses");
      setCourses(res.data.courses);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && name === "video") {
      setFormData((prev) => ({ ...prev, video: Array.from(files) }));
    } else if (files && name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

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
    const { title, description, image, video } = formData;

    if (!title || !description || !image || video.length === 0) {
      toast.error("All fields are required");
      return;
    }

    try {
      setIsUploading(true);
      setUpload(true);

      const imageUrl = await uploadFileToCloudinary(image, "image");
      const videoUrls = [];
      for (let i = 0; i < video.length; i++) {
        const url = await uploadFileToCloudinary(video[i], "video");
        videoUrls.push(url);
      }

      const payload = { title, description, image: imageUrl, videoUrls };
      const res = await axiosInstance.post("/api/courses", payload);

      toast.success(res.data.message || "Course created!");
      setFormData({ title: "", description: "", image: null, video: [] });
      if (videoInputRef.current) videoInputRef.current.value = "";
      setIsAddModalOpen(false);
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setIsUploading(false);
      setUpload(false);
      setProgress(0);
    }
  };

  return (
    <div className="p-6 mt-34">
      <button onClick={() => setIsAddModalOpen(true)}>Add Course</button>

      {isAddModalOpen && (
        <div>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Course Title"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Course Description"
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
          <input
            type="file"
            name="video"
            accept="video/*"
            multiple
            ref={videoInputRef}
            onChange={handleChange}
          />
          <button onClick={handleCreateCourse} disabled={isUploading}>
            {isUploading ? `Uploading... ${progress}%` : "Submit"}
          </button>
        </div>
      )}

      {courses.map((course) => (
        <div key={course.id}>
          <h3>{course.title}</h3>
          <p>{course.description}</p>
          <img src={course.image} alt={course.title} />
        </div>
      ))}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Page;

