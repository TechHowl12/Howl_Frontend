import axios from "axios";
import React, { useState } from "react";
import { ClimbingBoxLoader, ClipLoader } from "react-spinners";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

const Content = () => {
  const [file, setFile] = useState(null);
  const [state, setState] = useState({
    loading: false,
    contentData: null,
  });

  const [formData, setFormData] = useState({
    brand: "",
    campaign_type: "",
    objective: "",
    caption: "",
    hashtags: "",
    brandGuidelines: "",
    websiteLink: "",
    contentType: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = async () => {
    if (!formData.brand || !formData.campaign_type) {
      alert("Please fill up all required fields (Brand and Campaign Type)");
      return;
    }

    if (!file) {
      alert("Please upload a file");
      return;
    }

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "howl_digital");
    data.append("cloud_name", "dctd6p3eb");
    const resourceType = file.type.startsWith("video/") ? "video" : "image";

    try {
      setState((prev) => ({ ...prev, loading: true }));
      const uploadResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/dctd6p3eb/${resourceType}/upload`,
        data
      );
      const fileUrl = uploadResponse.data.secure_url;

      console.log("File uploaded successfully:", fileUrl);

      const completeData = {
        ...formData,
        post: fileUrl,
      };

      const response = await axios.post(
        "https://howl-performanceapi.onrender.com/content",
        completeData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Raw server response:", response.data);
      let parsedData = response.data;
      if (typeof response.data === "string") {
        try {
          parsedData = JSON.parse(response.data.replace(/```json\n|\n```/g, "").trim());
        } catch (error) {
          console.error("Failed to parse response.data as JSON:", error);
          parsedData = {};
        }
      }
      console.log("Parsed contentData:", parsedData);

      setState({
        loading: false,
        contentData: parsedData,
      });
    } catch (error) {
      console.error("Error uploading content:", error);
      alert("Failed to upload the content. Please try again.");
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const downloadAsDocx = () => {
    if (!state.contentData) {
      alert("No content data available to download");
      return;
    }

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun({ text: "Description Suggestions", bold: true, size: 28 })],
              spacing: { after: 200 },
            }),
            new Paragraph({
              text:
                (state.contentData.description_suggestions?.suggested_description ||
                  state.contentData.description_suggestions?.revised_description ||
                  state.contentData.description_improvements?.suggested_description ||
                  state.contentData.description_suggestions) ||
                "No description provided",
              spacing: { after: 200 },
            }),
            ...(state.contentData.description_suggestions?.reasoning ||
            state.contentData.description_improvements?.reasoning
              ? [
                  new Paragraph({
                    children: [new TextRun({ text: "Reasoning:", bold: true })],
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    text:
                      state.contentData.description_suggestions?.reasoning ||
                      state.contentData.description_improvements?.reasoning,
                    spacing: { after: 400 },
                  }),
                ]
              : []),
            new Paragraph({
              children: [new TextRun({ text: "Hashtag Suggestions", bold: true, size: 28 })],
              spacing: { after: 200 },
            }),
            new Paragraph({
              text:
                (state.contentData.hashtag_suggestions?.suggested_hashtags?.join(", ") ||
                  state.contentData.hashtag_suggestions?.join(", ") ||
                  state.contentData.hashtags?.join(", ")) ||
                "No hashtags provided",
              spacing: { after: 200 },
            }),
            ...(state.contentData.hashtag_suggestions?.reasoning
              ? [
                  new Paragraph({
                    children: [new TextRun({ text: "Reasoning:", bold: true })],
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    text: state.contentData.hashtag_suggestions.reasoning,
                    spacing: { after: 400 },
                  }),
                ]
              : []),
            new Paragraph({
              children: [new TextRun({ text: "Post Improvement Suggestions", bold: true, size: 28 })],
              spacing: { after: 200 },
            }),
            ...(state.contentData.post_improvement_suggestions?.suggestions &&
            Array.isArray(state.contentData.post_improvement_suggestions.suggestions)
              ? state.contentData.post_improvement_suggestions.suggestions.map((item) => [
                  new Paragraph({
                    text: `- ${item.suggestion || item.improvement || "No suggestion"}`,
                    spacing: { after: 100 },
                  }),
                  ...(item.reasoning
                    ? [
                        new Paragraph({
                          text: `Reasoning: ${item.reasoning}`,
                          spacing: { after: 200 },
                        }),
                      ]
                    : []),
                ]).flat()
              : Array.isArray(state.contentData.post_improvement_suggestions)
              ? state.contentData.post_improvement_suggestions.map((item) => [
                  new Paragraph({
                    text: `- ${item.improvement || item.suggestion || "No suggestion"}`,
                    spacing: { after: 100 },
                  }),
                  ...(item.reasoning
                    ? [
                        new Paragraph({
                          text: `Reasoning: ${item.reasoning}`,
                          spacing: { after: 200 },
                        }),
                      ]
                    : []),
                ]).flat()
              : state.contentData.post_improvements?.image_feedback ||
                state.contentData.post_improvements
              ? [
                  new Paragraph({
                    text: `- ${state.contentData.post_improvements.image_feedback || state.contentData.post_improvements}`,
                    spacing: { after: 100 },
                  }),
                  ...(state.contentData.post_improvements.reasoning
                    ? [
                        new Paragraph({
                          text: `Reasoning: ${state.contentData.post_improvements.reasoning}`,
                          spacing: { after: 200 },
                        }),
                      ]
                    : []),
                ]
              : new Paragraph({ text: "No suggestions provided", spacing: { after: 200 } })),
            new Paragraph({
              children: [new TextRun({ text: "Score", bold: true, size: 28 })],
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: `${state.contentData.score?.value || state.contentData.score || "N/A"} / 100`,
              spacing: { after: 200 },
            }),
            ...(state.contentData.score?.reasoning
              ? [
                  new Paragraph({
                    children: [new TextRun({ text: "Reasoning:", bold: true })],
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    text: state.contentData.score.reasoning,
                    spacing: { after: 400 },
                  }),
                ]
              : []),
            ...(state.contentData.overall_feedback
              ? [
                  new Paragraph({
                    children: [new TextRun({ text: "Overall Feedback", bold: true, size: 28 })],
                    spacing: { after: 200 },
                  }),
                  new Paragraph({
                    text:
                      (typeof state.contentData.overall_feedback === "object"
                        ? state.contentData.overall_feedback.text
                        : state.contentData.overall_feedback) || "No feedback provided",
                    spacing: { after: 400 },
                  }),
                ]
              : []),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "ContentData.docx");
    });
  };

  console.log("Rendering with state:", state);
  if (state.contentData) {
    console.log("Description:", state.contentData.description_suggestions || state.contentData.description_improvements);
    console.log("Hashtags:", state.contentData.hashtag_suggestions || state.contentData.hashtags);
    console.log("Improvements:", state.contentData.post_improvement_suggestions || state.contentData.post_improvements);
    console.log("Score:", state.contentData.score);
    console.log("Feedback:", state.contentData.overall_feedback);
  }

  return (
    <div className="bg-slate-100 py-20 px-4 sm:px-8">
      <h1 className="text-4xl text-center mb-6 mt-2 uppercase font-bold text-slate-800">Content</h1>
      <div className="flex flex-col xl:flex-row">
        <div className="xl:border-r-2 w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 max-sm:gap-7 items-center xl:w-1/3 h-full border-slate-700">
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-gray-500 font-medium text-sm bg-gray-100 file:cursor-pointer cursor-pointer file:border-0 file:py-2 file:px-4 file:mr-4 file:bg-gray-800 file:hover:bg-gray-700 file:text-slate-100 file:rounded mt-4"
          />
          <div className="w-full max-w-sm min-w-[200px] relative mt-4">
            <label className="block mb-2 text-sm text-slate-600">Brand</label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pr-3 pl-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-700 hover:border-slate-500 shadow-sm focus:shadow"
                name="brand"
                placeholder="Enter your brand"
                onChange={handleInputChange}
                value={formData.brand}
                required
              />
              <button
                className="absolute left-1 top-1 rounded bg-slate-800 p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="w-full max-w-sm min-w-[200px] relative mt-4">
            <label className="block mb-2 text-sm text-slate-600">Campaign Type</label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pr-3 pl-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-700 hover:border-slate-500 shadow-sm focus:shadow"
                name="campaign_type"
                placeholder="Enter Campaign Type"
                onChange={handleInputChange}
                value={formData.campaign_type}
              />
              <button
                className="absolute left-1 top-1 rounded bg-slate-800 p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="w-full max-w-sm min-w-[200px] relative mt-4">
            <label className="block mb-2 text-sm text-slate-600">Objective</label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pr-3 pl-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-700 hover:border-slate-500 shadow-sm focus:shadow"
                name="objective"
                placeholder="Enter Objective"
                onChange={handleInputChange}
                value={formData.objective}
              />
              <button
                className="absolute left-1 top-1 rounded bg-slate-800 p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="w-full max-w-sm min-w-[200px] relative mt-4">
            <label className="block mb-2 text-sm text-slate-600">Caption</label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pr-3 pl-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-700 hover:border-slate-500 shadow-sm focus:shadow"
                name="caption"
                placeholder="Enter Caption"
                onChange={handleInputChange}
                value={formData.caption}
              />
              <button
                className="absolute left-1 top-1 rounded bg-slate-800 p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="w-full max-w-sm min-w-[200px] relative mt-4">
            <label className="block mb-2 text-sm text-slate-600">Hashtags</label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pr-3 pl-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-700 hover:border-slate-500 shadow-sm focus:shadow"
                name="hashtags"
                placeholder="Enter Hashtags"
                onChange={handleInputChange}
                value={formData.hashtags}
              />
              <button
                className="absolute left-1 top-1 rounded bg-slate-800 p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="w-full max-w-sm min-w-[200px] relative mt-4">
            <label className="block mb-2 text-sm text-slate-600">Brand Guidelines</label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pr-3 pl-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-700 hover:border-slate-500 shadow-sm focus:shadow"
                name="brandGuidelines"
                placeholder="Enter brandGuidelines"
                onChange={handleInputChange}
                value={formData.brandGuidelines}
              />
              <button
                className="absolute left-1 top-1 rounded bg-slate-800 p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="w-full max-w-sm min-w-[200px] relative mt-4">
            <label className="block mb-2 text-sm text-slate-600">Website Link</label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pr-3 pl-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-700 hover:border-slate-500 shadow-sm focus:shadow"
                name="websiteLink"
                placeholder="Enter websiteLink"
                onChange={handleInputChange}
                value={formData.websiteLink}
              />
              <button
                className="absolute left-1 top-1 rounded bg-slate-800 p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="w-full max-w-sm min-w-[200px] relative mt-4">
            <label className="block mb-2 text-sm text-slate-600">Content Type</label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pr-3 pl-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-700 hover:border-slate-500 shadow-sm focus:shadow"
                name="contentType"
                placeholder="Enter contentType"
                onChange={handleInputChange}
                value={formData.contentType}
              />
              <button
                className="absolute left-1 top-1 rounded bg-slate-800 p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
          <button
            onClick={handleFileUpload}
            disabled={!formData || state.loading}
            className="rounded-md flex justify-center w-32 bg-slate-800 py-3 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 mt-6"
          >
            {state.loading ? <ClipLoader size={20} /> : "Submit"}
          </button>
        </div>
        <div className="xl:w-2/3 w-full mt-10 xl:mt-0 flex px-5 flex-col justify-center items-center">
          {state.loading ? (
            <ClimbingBoxLoader size={40} color="#5d5d5d" />
          ) : state.contentData ? (
            <div className="w-full max-w-2xl">
              <button
                onClick={downloadAsDocx}
                className="mt-4 rounded-md flex justify-center ml-auto bg-blue-500 py-2 px-4 border border-transparent text-center text-sm text-white transition-all hover:bg-blue-600"
              >
                Download
              </button>
              <div className="mt-6 text-slate-700">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Description Suggestions</h2>
                <p className="text-base mb-2 leading-relaxed">
                  {(state.contentData.description_suggestions?.suggested_description ||
                    state.contentData.description_suggestions?.revised_description ||
                    state.contentData.description_improvements?.suggested_description ||
                    state.contentData.description_suggestions) ||
                    "No description provided"}
                </p>
                {(state.contentData.description_suggestions?.reasoning ||
                  state.contentData.description_improvements?.reasoning) && (
                  <p className="text-sm italic text-slate-600 mb-6">
                    <span className="font-semibold">Reasoning:</span>{" "}
                    {state.contentData.description_suggestions?.reasoning ||
                      state.contentData.description_improvements?.reasoning}
                  </p>
                )}

                <h2 className="text-2xl font-bold text-slate-800 mb-2">Hashtag Suggestions</h2>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(state.contentData.hashtag_suggestions?.suggested_hashtags ||
                    state.contentData.hashtag_suggestions ||
                    state.contentData.hashtags) &&
                  (state.contentData.hashtag_suggestions?.suggested_hashtags ||
                    state.contentData.hashtag_suggestions ||
                    state.contentData.hashtags).length > 0 ? (
                    (state.contentData.hashtag_suggestions?.suggested_hashtags ||
                      state.contentData.hashtag_suggestions ||
                      state.contentData.hashtags).map((hashtag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-slate-200 text-slate-700 text-sm font-medium py-1 px-2 rounded"
                      >
                        {hashtag}
                      </span>
                    ))
                  ) : (
                    <p>{}</p>
                  )}
                </div>
                {state.contentData.hashtag_suggestions?.reasoning && (
                  <p className="text-sm italic text-slate-600 mb-6">
                    <span className="font-semibold">Reasoning:</span>{" "}
                    {state.contentData.hashtag_suggestions.reasoning}
                  </p>
                )}

                <h2 className="text-2xl font-bold text-slate-800 mb-2">Post Improvement Suggestions</h2>
                <ul className="list-disc pl-5 mb-2 text-base leading-relaxed">
                  {state.contentData.post_improvement_suggestions?.suggestions &&
                  Array.isArray(state.contentData.post_improvement_suggestions.suggestions) ? (
                    state.contentData.post_improvement_suggestions.suggestions.length > 0 ? (
                      state.contentData.post_improvement_suggestions.suggestions.map((item, index) => (
                        <li key={index} className="mb-4">
                          {item.suggestion || item.improvement || "No suggestion"}
                          {item.reasoning && (
                            <p className="text-sm italic text-slate-600 mt-1">
                              <span className="font-semibold">Reasoning:</span> {item.reasoning}
                            </p>
                          )}
                        </li>
                      ))
                    ) : (
                      <li>{}</li>
                    )
                  ) : Array.isArray(state.contentData.post_improvement_suggestions) ? (
                    state.contentData.post_improvement_suggestions.length > 0 ? (
                      state.contentData.post_improvement_suggestions.map((item, index) => (
                        <li key={index} className="mb-4">
                          {item.improvement || item.suggestion || "No suggestion"}
                          {item.reasoning && (
                            <p className="text-sm italic text-slate-600 mt-1">
                              <span className="font-semibold">Reasoning:</span> {item.reasoning}
                            </p>
                          )}
                        </li>
                      ))
                    ) : (
                      <li></li>
                    )
                  ) : state.contentData.post_improvements?.image_feedback ||
                    state.contentData.post_improvements ? (
                    <li className="mb-4">
                      {state.contentData.post_improvements.image_feedback || state.contentData.post_improvements}
                      {state.contentData.post_improvements?.reasoning && (
                        <p className="text-sm italic text-slate-600 mt-1">
                          <span className="font-semibold">Reasoning:</span>{" "}
                          {state.contentData.post_improvements.reasoning}
                        </p>
                      )}
                    </li>
                  ) : (
                    <li>{}</li>
                  )}
                </ul>

                <h2 className="text-2xl font-bold text-slate-800 mb-2">Score</h2>
                <p className="text-base mb-2">
                  <span className="font-semibold">
                    {(typeof state.contentData.score === "object"
                      ? state.contentData.score.value
                      : state.contentData.score) || "N/A"}
                  </span>{" "}
                  / 100
                </p>
                {state.contentData.score?.reasoning && (
                  <p className="text-sm italic text-slate-600 mb-6">
                    <span className="font-semibold">Reasoning:</span> {state.contentData.score.reasoning}
                  </p>
                )}

                {state.contentData.overall_feedback && (
                  <>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Overall Feedback</h2>
                    <p className="text-base mb-6 leading-relaxed">
                      {(typeof state.contentData.overall_feedback === "object"
                        ? state.contentData.overall_feedback.text
                        : state.contentData.overall_feedback) || "No feedback provided"}
                    </p>
                  </>
                )}
              </div>
            </div>
          ) : (
            <h1 className="text-xl font-bold text-center">Fill up all the fields</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default Content;