import axios from "axios";
import React, { useState } from "react";
import {
  ClimbingBoxLoader,
  ClipLoader,
} from "react-spinners";
import ReactMarkdown from 'react-markdown';
import { Document, Packer, Paragraph } from "docx";
import { saveAs } from "file-saver";

const Content = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contentData, setContentData] = useState("");
  const [formData, setFormData] = useState({
    brand: "",
    campaign_type: "",
    objective: "",
    caption: "",
    hashtags: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = async () => {
    if (formData.brand === "" && formData.campaign_type === "") {
      alert("Please fill up all the fields");
      return;
    }

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "howl_digital");
    data.append("cloud_name", "dctd6p3eb");
    const resourceType = file.type.startsWith("video/") ? "video" : "image";

    try {
      setLoading(true);
      const uploadResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/dctd6p3eb/${resourceType}/upload`,
        data
      );
      const fileUrl = uploadResponse.data.secure_url;

      // Create JSON object including the uploaded file URL
      const completeData = {
        ...formData,
        post: fileUrl,
      };

      // Sending everything as JSON to your server endpoint
      const response = await axios.post(
        "https://howl-performance.onrender.com/content",
        completeData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false);
      setContentData(response.data);
    } catch (error) {
      console.error("Error uploading content:", error);
      alert("Failed to upload the content. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const downloadAsDocx = () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: contentData,
              style: "Normal",
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "ContentData.docx");
    });
  };

  return (
    <div className="bg-slate-100 py-20 px-4 sm:px-8">
      <h1 className="text-4xl text-center mb-6 mt-2 uppercase font-bold text-slate-700">
        Content
      </h1>
      <div className="flex flex-col xl:flex-row">
        <div className="xl:border-r-2 w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 max-sm:gap-7 items-center xl:w-1/3 h-full border-slate-700">
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-gray-500 font-medium text-sm bg-gray-100 file:cursor-pointer cursor-pointer file:border-0 file:py-2 file:px-4 file:mr-4 file:bg-gray-800 file:hover:bg-gray-700 file:text-slate-100 file:rounded mt-4"
          />

          <div class="w-full max-w-sm min-w-[200px] relative mt-4">
            <label class="block mb-2 text-sm text-slate-600">Brand</label>

            <div class="relative">
              <input
                type="text"
                class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pr-3 pl-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-700 hover:border-slate-500 shadow-sm focus:shadow"
                name="brand"
                placeholder="Enter your brand"
                onChange={handleInputChange}
                value={formData.brand}
                required
              />
              <button
                class="absolute left-1 top-1 rounded bg-slate-800 p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  class="w-4 h-4"
                >
                  <path
                    fill-rule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div class="w-full max-w-sm min-w-[200px] relative mt-4">
            <label class="block mb-2 text-sm text-slate-600">
              Campaign Type
            </label>

            <div class="relative">
              <input
                type="text"
                class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pr-3 pl-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-700 hover:border-slate-500 shadow-sm focus:shadow"
                name="campaign_type"
                placeholder="Enter Campaign Type"
                onChange={handleInputChange}
                value={formData.campaign_type}
              />
              <button
                class="absolute left-1 top-1 rounded bg-slate-800 p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  class="w-4 h-4"
                >
                  <path
                    fill-rule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div class="w-full max-w-sm min-w-[200px] relative mt-4">
            <label class="block mb-2 text-sm text-slate-600">Objective</label>

            <div class="relative">
              <input
                type="text"
                class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pr-3 pl-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-700 hover:border-slate-500 shadow-sm focus:shadow"
                name="objective"
                placeholder="Enter Objective"
                onChange={handleInputChange}
                value={formData.objective}
              />
              <button
                class="absolute left-1 top-1 rounded bg-slate-800 p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  class="w-4 h-4"
                >
                  <path
                    fill-rule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div class="w-full max-w-sm min-w-[200px] relative mt-4">
            <label class="block mb-2 text-sm text-slate-600">Caption</label>

            <div class="relative">
              <input
                type="text"
                class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pr-3 pl-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-700 hover:border-slate-500 shadow-sm focus:shadow"
                name="caption"
                placeholder="Enter Caption"
                onChange={handleInputChange}
                value={formData.caption}
              />
              <button
                class="absolute left-1 top-1 rounded bg-slate-800 p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  class="w-4 h-4"
                >
                  <path
                    fill-rule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div class="w-full max-w-sm min-w-[200px] relative mt-4">
            <label class="block mb-2 text-sm text-slate-600">Hashtags</label>

            <div class="relative">
              <input
                type="text"
                class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pr-3 pl-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-700 hover:border-slate-500 shadow-sm focus:shadow"
                name="hashtags"
                placeholder="Enter Hashtags"
                onChange={handleInputChange}
                value={formData.hashtags}
              />
              <button
                class="absolute left-1 top-1 rounded bg-slate-800 p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  class="w-4 h-4"
                >
                  <path
                    fill-rule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
          <button
            onClick={handleFileUpload}
            disabled={!formData}
            className="rounded-md flex justify-center w-32 bg-slate-800 py-3 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 mt-6"
          >
            {loading ? <ClipLoader size={20} /> : "Submit"}
          </button>
        </div>
        <div className="xl:w-2/3 w-full mt-10 xl:mt-0 flex px-5 flex-col justify-center items-center">
          {loading ? (
            <ClimbingBoxLoader size={40} color="#5d5d5d" />
          ) : contentData ? (
            <div>
              <button
                onClick={downloadAsDocx}
                className="mt-4 rounded-md flex justify-center ml-auto bg-blue-500 py-2 px-4 border border-transparent text-center text-sm text-white transition-all hover:bg-blue-600"
              >
                Download
              </button>
              <ReactMarkdown children={contentData} className="leading-10" />
            </div>
                      
          ) : (
            <h1 className="text-xl font-bold">Fill up all the fields</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default Content;
