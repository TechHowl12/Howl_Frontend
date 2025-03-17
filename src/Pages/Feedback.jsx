import axios from "axios";
import React, { useState, useEffect } from "react";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

const Feedback = () => {
  const [state, setState] = useState({
    loading: false,
    feedbackData: null,
    successMessage: "", // New state for success message
  });

  const [formData, setFormData] = useState({
    name: "",
    input: "",
    output: "",
    feedback: "",
    rating: "",
  });

  // Check for content form data in localStorage
  useEffect(() => {
    const contentFormData = localStorage.getItem('contentFormData');
    if (contentFormData) {
      try {
        const parsedData = JSON.parse(contentFormData);
        setFormData(prevData => ({
          ...prevData,
          name: parsedData.name || '',
          input: parsedData.input || '',
        }));
        // Clear localStorage after retrieving data
        localStorage.removeItem('contentFormData');
      } catch (error) {
        console.error("Error parsing content form data:", error);
      }
    }

    // Check for content analysis results
    const storedAnalysisResults = localStorage.getItem('contentAnalysisResults');
    if (storedAnalysisResults) {
      try {
        const analysisData = JSON.parse(storedAnalysisResults);
        setFormData(prevData => ({
          ...prevData,
          output: analysisData.output || prevData.output
        }));
        // Clear localStorage after retrieving data
        localStorage.removeItem('contentAnalysisResults');
      } catch (error) {
        console.error("Error parsing content analysis results:", error);
      }
    }
  }, []); 

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
      setState((prev) => ({ ...prev, loading: true, successMessage: "" }));
      
      const response = await axios.post(
        "https://howl-performanceapi.onrender.com/feedback",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      // Simulated response
      const simulatedResponse = {
        data: formData // Simply return the formData as the response for testing
      };

      setTimeout(() => { // Add a slight delay to mimic API call
        setState({
          loading: false,
          feedbackData: simulatedResponse.data,
          successMessage: "Feedback submitted successfully", // Set success message
        });
      }, 1000);

    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
      setState((prev) => ({ ...prev, loading: false, successMessage: "" }));
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
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 mt-40">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 animate-slideUp">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-brand-primary border-b pb-4">Submit Your Feedback</h2>
          
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Form Section */}
            <div className="xl:w-1/3 border-r border-gray-200 pr-8">
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-brand-primary">Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full bg-transparent placeholder:text-gray-400 text-gray-700 text-sm border border-gray-200 rounded-md pr-3 pl-10 py-2 transition duration-300 ease focus:outline-none focus:border-brand-primary hover:border-gray-300 shadow-sm focus:shadow"
                    name="name"
                    placeholder="Enter your name"
                    onChange={handleInputChange}
                    // value={formData.name}
                    required
                  />
                  <div className="absolute left-1 top-1 rounded bg-brand-primary p-1.5 text-white">
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
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-brand-primary">Input <span className="text-red-500">*</span></label>
                <div className="relative">
                  <textarea
                    className="w-full bg-transparent placeholder:text-gray-400 text-gray-700 text-sm border border-gray-200 rounded-md pr-3 pl-3 py-2 min-h-[100px] transition duration-300 ease focus:outline-none focus:border-brand-primary hover:border-gray-300 shadow-sm focus:shadow"
                    name="input"
                    placeholder="Enter your input"
                    onChange={handleInputChange}
                    value={formData.input}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-brand-primary">Output <span className="text-red-500">*</span></label>
                <div className="relative">
                  <textarea
                    className="w-full bg-transparent placeholder:text-gray-400 text-gray-700 text-sm border border-gray-200 rounded-md pr-3 pl-3 py-2 min-h-[100px] transition duration-300 ease focus:outline-none focus:border-brand-primary hover:border-gray-300 shadow-sm focus:shadow"
                    name="output"
                    placeholder="Enter output"
                    onChange={handleInputChange}
                    value={formData.output}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-brand-primary">Feedback <span className="text-red-500">*</span></label>
                <div className="relative">
                  <textarea
                    className="w-full bg-transparent placeholder:text-gray-400 text-gray-700 text-sm border border-gray-200 rounded-md pr-3 pl-3 py-2 min-h-[100px] transition duration-300 ease focus:outline-none focus:border-brand-primary hover:border-gray-300 shadow-sm focus:shadow"
                    name="feedback"
                    placeholder="Enter your feedback"
                    onChange={handleInputChange}
                    value={formData.feedback}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-brand-primary">Rating <span className="text-red-500">*</span></label>
                <div className="flex space-x-4 mt-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        formData.rating === rating.toString()
                          ? "bg-brand-primary text-white"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                      onClick={() => setFormData((prev) => ({ ...prev, rating: rating.toString() }))}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={state.loading}
                className="btn-primary px-6 py-3 mt-4"
              >
                {state.loading ? (
                  <div className="flex items-center justify-center">
                    <div className="rotating-loader-small mr-2">
                      <div className="circle-small"></div>
                    </div>
                    <span className="ml-2">Submitting...</span>
                  </div>
                ) : (
                  "Submit Feedback"
                )}
              </button>
            </div>

            {/* Display Section */}
            <div className="xl:w-2/3">
              {state.loading ? (
                <div className="flex flex-col justify-center items-center h-[400px]">
                  <div className="rotating-loader">
                    <div className="circle"></div>
                  </div>
                  <p className="text-lg text-brand-primary mt-4">Processing your feedback...</p>
                </div>
              ) : state.feedbackData ? (
                <div className="w-full">
                  {/* Success message display */}
                  {state.successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {state.successMessage}
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <button
                      onClick={downloadAsDocx}
                      className="flex items-center justify-center text-sm bg-brand-primary text-white px-4 py-3 rounded-lg hover:bg-brand-light transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Your Feedback
                    </button>
                  </div>
                  
                  <div className="mt-6 bg-gray-50 p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-brand-primary mb-6 pb-3 border-b border-gray-200">Feedback Summary</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-medium text-brand-primary">Name</h4>
                        <p className="mt-2 text-gray-700">{state.feedbackData.name || "No name provided"}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-medium text-brand-primary">Input</h4>
                        <p className="mt-2 text-gray-700 whitespace-pre-wrap">{state.feedbackData.input || "No input provided"}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-medium text-brand-primary">Output</h4>
                        <p className="mt-2 text-gray-700 whitespace-pre-wrap">{state.feedbackData.output || "No output provided"}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-medium text-brand-primary">Feedback</h4>
                        <p className="mt-2 text-gray-700 whitespace-pre-wrap">{state.feedbackData.feedback || "No feedback provided"}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-medium text-brand-primary">Rating</h4>
                        <div className="flex mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              xmlns="http://www.w3.org/2000/svg"
                              className={`h-6 w-6 ${
                                parseInt(state.feedbackData.rating) >= star
                                  ? "text-yellow-500 fill-current"
                                  : "text-gray-300 fill-current"
                              }`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-2 text-gray-700">
                            ({state.feedbackData.rating || "No"} out of 5)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] bg-gray-50 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-4 text-xl font-medium text-brand-primary">Fill in all the required fields</h3>
                  <p className="mt-2 text-gray-500">Your feedback will appear here after submission</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .rotating-loader {
          position: relative;
          width: 100px;
          height: 100px;
        }

        .circle {
          position: absolute;
          width: 80px;
          height: 80px;
          border: 8px solid #3D155D;
          border-top: 8px solid #E0BBE4;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .rotating-loader-small {
          position: relative;
          width: 24px;
          height: 24px;
        }

        .circle-small {
          position: absolute;
          width: 20px;
          height: 20px;
          border: 4px solid #3D155D;
          border-top: 4px solid #E0BBE4;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Feedback;
