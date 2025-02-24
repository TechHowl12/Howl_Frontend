import axios from "axios";
import React, { useState } from "react";
import { ClimbingBoxLoader, ClipLoader } from "react-spinners";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

const Feedback = () => {
  const [state, setState] = useState({
    loading: false,
    feedbackData: null,
  });

  const [formData, setFormData] = useState({
    name: "",
    input: "",
    output: "",
    feedback: "",
    rating: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.input || !formData.output || !formData.feedback || !formData.rating) {
      alert("Please fill up all required fields");
      return;
    }

    try {
      setState((prev) => ({ ...prev, loading: true }));
      const response = await axios.post(
        "https://howl-performanceapi.onrender.com/feedback", // Adjust URL as needed
        formData,
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
      console.log("Parsed feedbackData:", parsedData);

      setState({
        loading: false,
        feedbackData: parsedData,
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const downloadAsDocx = () => {
    if (!state.feedbackData) {
      alert("No feedback data available to download");
      return;
    }

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun({ text: "Name", bold: true, size: 28 })],
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: state.feedbackData.name || "No name provided",
              spacing: { after: 400 },
            }),
            new Paragraph({
              children: [new TextRun({ text: "Input", bold: true, size: 28 })],
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: state.feedbackData.input || "No input provided",
              spacing: { after: 400 },
            }),
            new Paragraph({
              children: [new TextRun({ text: "Output", bold: true, size: 28 })],
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: state.feedbackData.output || "No output provided",
              spacing: { after: 400 },
            }),
            new Paragraph({
              children: [new TextRun({ text: "Feedback", bold: true, size: 28 })],
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: state.feedbackData.feedback || "No feedback provided",
              spacing: { after: 400 },
            }),
            new Paragraph({
              children: [new TextRun({ text: "Rating", bold: true, size: 28 })],
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: state.feedbackData.rating || "No rating provided",
              spacing: { after: 400 },
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "FeedbackData.docx");
    });
  };

  console.log("Rendering with state:", state);

  return (
    <div className="bg-slate-100 py-20 px-4 sm:px-8">
      <h1 className="text-4xl text-center mb-6 mt-2 uppercase font-bold text-slate-700">
        Feedback
      </h1>
      <div className="flex flex-col xl:flex-row">
        <div className="xl:border-r-2 w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 max-sm:gap-7 items-center xl:w-1/3 h-full border-slate-700">
          <div className="w-full max-w-sm min-w-[200px] relative mt-4">
            <label className="block mb-2 text-sm text-slate-600">Name</label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pr-3 pl-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-700 hover:border-slate-500 shadow-sm focus:shadow"
                name="name"
                placeholder="Enter your name"
                onChange={handleInputChange}
                value={formData.name}
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
            <label className="block mb-2 text-sm text-slate-600">Input</label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pr-3 pl-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-700 hover:border-slate-500 shadow-sm focus:shadow"
                name="input"
                placeholder="Enter your input"
                onChange={handleInputChange}
                value={formData.input}
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
            <label className="block mb-2 text-sm text-slate-600">Output</label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pr-3 pl-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-700 hover:border-slate-500 shadow-sm focus:shadow"
                name="output"
                placeholder="Enter output"
                onChange={handleInputChange}
                value={formData.output}
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
            <label className="block mb-2 text-sm text-slate-600">Feedback</label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pr-3 pl-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-700 hover:border-slate-500 shadow-sm focus:shadow"
                name="feedback"
                placeholder="Enter your feedback"
                onChange={handleInputChange}
                value={formData.feedback}
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
            <label className="block mb-2 text-sm text-slate-600">Rating</label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pr-3 pl-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-700 hover:border-slate-500 shadow-sm focus:shadow"
                name="rating"
                placeholder="Enter rating (e.g., 1-5)"
                onChange={handleInputChange}
                value={formData.rating}
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
          <button
            onClick={handleSubmit}
            disabled={!formData || state.loading}
            className="rounded-md flex justify-center w-32 bg-slate-800 py-3 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 mt-6"
          >
            {state.loading ? <ClipLoader size={20} /> : "Submit"}
          </button>
        </div>
        <div className="xl:w-2/3 w-full mt-10 xl:mt-0 flex px-5 flex-col justify-center items-center">
          {state.loading ? (
            <ClimbingBoxLoader size={40} color="#5d5d5d" />
          ) : state.feedbackData ? (
            <div className="w-full max-w-2xl">
              <button
                onClick={downloadAsDocx}
                className="mt-4 rounded-md flex justify-center ml-auto bg-blue-500 py-2 px-4 border border-transparent text-center text-sm text-white transition-all hover:bg-blue-600"
              >
                Download
              </button>
              <div className="mt-6 text-slate-700">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Name</h2>
                <p className="text-base mb-6 leading-relaxed">
                  {state.feedbackData.name || "No name provided"}
                </p>

                <h2 className="text-2xl font-bold text-slate-800 mb-2">Input</h2>
                <p className="text-base mb-6 leading-relaxed">
                  {state.feedbackData.input || "No input provided"}
                </p>

                <h2 className="text-2xl font-bold text-slate-800 mb-2">Output</h2>
                <p className="text-base mb-6 leading-relaxed">
                  {state.feedbackData.output || "No output provided"}
                </p>

                <h2 className="text-2xl font-bold text-slate-800 mb-2">Feedback</h2>
                <p className="text-base mb-6 leading-relaxed">
                  {state.feedbackData.feedback || "No feedback provided"}
                </p>

                <h2 className="text-2xl font-bold text-slate-800 mb-2">Rating</h2>
                <p className="text-base mb-6 leading-relaxed">
                  {state.feedbackData.rating || "No rating provided"}
                </p>
              </div>
            </div>
          ) : (
            <h1 className="text-xl font-bold">Fill up all the fields</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;