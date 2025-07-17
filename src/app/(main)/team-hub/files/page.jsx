"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FileText, FileImage, FileDown } from "lucide-react";

const FilesPage = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/messages").then((res) => {
      const fileOnly = res.data.filter((m) => m.fileUrl);
      setFiles(fileOnly);
    });
  }, []);

  const getFileIcon = (url) => {
    if (url.endsWith(".pdf")) return <FileText className="text-red-600 w-8 h-8" />;
    if (url.match(/\.(jpg|jpeg|png|gif)$/i)) return <FileImage className="text-blue-500 w-8 h-8" />;
    return <FileDown className="text-gray-600 w-8 h-8" />;
  };

  return (
    <div className="max-w-6xl mx-auto mt-28 px-6">
      <h2 className="text-4xl font-bold text-gray-900 mb-10">📂 Shared Files</h2>

      {files.length === 0 ? (
        <div className="text-gray-500">No files shared yet.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {files.map((m, i) => {
            const fileName = m.fileUrl.split("/").pop();

            return (
              <div
                key={i}
                className="group bg-gradient-to-br from-white to-gray-100 border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 ease-in-out p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3 justify-center">
                    <div className="p-3 bg-white rounded-full shadow-md">
                      {getFileIcon(m.fileUrl)}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-base font-medium text-gray-800 truncate mb-4">
                  {fileName}
                </p>

                <a
                  href={`http://localhost:5000${m.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full text-center text-sm font-medium px-4 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                >
                  View / Download
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FilesPage;
