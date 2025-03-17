import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { ClipLoader } from "react-spinners";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

const AnimatedScore = ({ score }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);

  useEffect(() => {
    if (score === "N/A" || !score) {
      setCount("N/A");
      return;
    }

    const endNum = parseInt(score);
    if (isNaN(endNum)) {
      setCount(score);
      return;
    }

    const startTime = Date.now();
    const duration = 2000;
    const endTime = startTime + duration;

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min(1, (now - startTime) / duration);
      const currentCount = Math.floor(endNum * progress);

      if (now <= endTime) {
        setCount(currentCount);
        countRef.current = requestAnimationFrame(updateCount);
      } else {
        setCount(endNum);
      }
    };

    countRef.current = requestAnimationFrame(updateCount);

    return () => {
      if (countRef.current) {
        cancelAnimationFrame(countRef.current);
      }
    };
  }, [score]);

  return count;
};

const Content = () => {
  const [file, setFile] = useState(null);
  const [state, setState] = useState({
    loading: false,
    contentData: null,
    contentType: null, // Track image or video
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
        content_type: resourceType,
      };

      // Save form data to localStorage for feedback form
      localStorage.setItem('contentFormData', JSON.stringify({
        name: formData.brand,
        input: `Content Type: ${formData.contentType}\nCampaign Type: ${formData.campaign_type}\nObjective: ${formData.objective}\nCaption: ${formData.caption}\nHashtags: ${formData.hashtags}\nBrand Guidelines: ${formData.brandGuidelines}\nWebsite: ${formData.websiteLink}`,
      }));

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
        contentType: resourceType,
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
  
    const contentTypeLabel = state.contentType === "video" ? "Reel" : "Image";
    const improvements = state.contentData.post_improvement_suggestions || state.contentData.post_improvements || {};
  
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Description Suggestions
            new Paragraph({
              children: [new TextRun({ text: `${contentTypeLabel} Description Suggestions`, bold: true, size: 28 })],
              spacing: { after: 200 },
            }),
            new Paragraph({
              text:
                state.contentData?.suggestions?.description?.suggested_description ||
                state.contentData?.suggestions?.description?.revised_description ||
                state.contentData?.suggestions?.description?.improved_description ||
                state.contentData.description_suggestions ||
                `No description suggestions provided for this ${state.contentType || "content"}`,
              spacing: { after: 200 },
            }),
            ...(state.contentData?.suggestions?.description?.reasoning
              ? [
                  new Paragraph({ children: [new TextRun({ text: "Reasoning:", bold: true })], spacing: { after: 100 } }),
                  new Paragraph({
                    text: state.contentData.suggestions.description.reasoning,
                    spacing: { after: 400 },
                  }),
                ]
              : []),
  
            // Hashtag Suggestions
            new Paragraph({
              children: [new TextRun({ text: `${contentTypeLabel} Hashtag Suggestions`, bold: true, size: 28 })],
              spacing: { after: 200 },
            }),
            new Paragraph({
              text:
                Array.isArray(state.contentData?.suggestions?.hashtags?.suggested_hashtags)
                  ? state.contentData.suggestions.hashtags.suggested_hashtags.join(", ")
                  : typeof state.contentData?.suggestions?.hashtags?.suggested_hashtags === "string"
                  ? state.contentData.suggestions.hashtags.suggested_hashtags
                  : `No hashtag suggestions provided for this ${state.contentType || "content"}`,
              spacing: { after: 200 },
            }),
            ...(state.contentData?.suggestions?.hashtags?.reasoning
              ? [
                  new Paragraph({ children: [new TextRun({ text: "Reasoning:", bold: true })], spacing: { after: 100 } }),
                  new Paragraph({
                    text: state.contentData.suggestions.hashtags.reasoning,
                    spacing: { after: 400 },
                  }),
                ]
              : []),
  
            // Improvement Suggestions
            new Paragraph({
              children: [new TextRun({ text: `${contentTypeLabel} Improvement Suggestions`, bold: true, size: 28 })],
              spacing: { after: 200 },
            }),
            ...(Array.isArray(state.contentData?.suggestions?.post_improvements?.suggested_changes)
              ? state.contentData.suggestions.post_improvements.suggested_changes.map((item) => [
                  new Paragraph({
                    text: `- ${item.element ? `${item.element}: ${item.change}` : item.change || item.improvement || item.suggestion || "No suggestion"}`,
                    spacing: { after: 100 },
                  }),
                  ...(item.reasoning
                    ? [new Paragraph({ text: `Reasoning: ${item.reasoning}`, spacing: { after: 200 } })]
                    : []),
                ]).flat()
              : improvements.image_feedback || improvements.suggestion || improvements.improvement
              ? [
                  new Paragraph({
                    text: `- ${improvements.image_feedback || (improvements.element ? `${improvements.element}: ${improvements.suggestion}` : improvements.suggestion || improvements.improvement || "No suggestion")}`,
                    spacing: { after: 100 },
                  }),
                  ...(improvements.reasoning
                    ? [new Paragraph({ text: `Reasoning: ${improvements.reasoning}`, spacing: { after: 200 } })]
                    : []),
                ]
              : [
                  new Paragraph({
                    text: `No improvement suggestions provided for this ${state.contentType || "content"}`,
                    spacing: { after: 200 },
                  }),
                ]),
  
            // Score
            new Paragraph({
              children: [new TextRun({ text: `${contentTypeLabel} Score`, bold: true, size: 28 })],
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({ 
                  text: `${state.contentData?.suggestions?.score?.value || 
                   state.contentData?.suggestions?.score || "N/A"}`,
                  bold: true,
                  size: 24 
                }),
                new TextRun({ text: " / 100", size: 24 })
              ],
              spacing: { after: 200 },
            }),
            ...(state.contentData?.suggestions?.score?.reasoning
              ? processScoreReasoningForDocx(state.contentData?.suggestions?.score?.reasoning)
              : []),
  
            // Overall Feedback
            ...(state.contentData?.overall_feedback
              ? [
                  new Paragraph({
                    children: [new TextRun({ text: `Overall ${contentTypeLabel} Feedback`, bold: true, size: 28 })],
                    spacing: { after: 200 },
                  }),
                  new Paragraph({
                    text:
                      typeof state.contentData.overall_feedback === "object"
                        ? state.contentData.overall_feedback.text
                        : state.contentData.overall_feedback || "No feedback provided",
                    spacing: { after: 400 },
                  }),
                ]
              : []),
          ],
        },
      ],
    });
  
    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `ContentData_${state.contentType || "unknown"}.docx`);
    });
  };

  const formatScoreReasoning = (text) => {
    if (!text) return "";
    
    // Format numbered points with point values
    text = text.replace(/(\d+)\.\s*(.*?)(?=\n\d+\.|\n\n|$)/gs, (match, num, content) => {
      // Check if content contains point value in parentheses
      const pointMatch = content.match(/\((\d+)\s*points?\)/i);
      if (pointMatch) {
        const points = pointMatch[1];
        content = content.replace(/\(\d+\s*points?\)/i, '');
        return `<p class="mb-2"><span class="point-value">(${points} points)</span> ${content}</p>`;
      }
      return `<p class="mb-2">${content}</p>`;
    });
    
    // Format bulleted points
    text = text.replace(/[•*-]\s*(.*?)(?=\n[•*-]|\n\n|$)/gs, '<p class="mb-2">$1</p>');
    
    // Format hashtag points
    text = text.replace(/#([^#\s]+)/g, '<strong class="text-brand-primary">#$1</strong>');
    
    // Highlight key metrics and numbers
    text = text.replace(/(\d+(?:\.\d+)?%)/g, '<strong class="text-brand-primary">$1</strong>');
    text = text.replace(/(\b\d+\/\d+\b)/g, '<strong class="text-brand-primary">$1</strong>');
    
    // Add general formatting for paragraphs
    return text.split('\n\n').map(para => `<p class="mb-2">${para}</p>`).join('');
  };

  const processScoreReasoningForDocx = (reasoning) => {
    if (!reasoning) return [];
    
    const paragraphs = [];
    const lines = reasoning.split('\n');
    
    lines.forEach(line => {
      if (!line.trim()) return;
      
      // Check if it's a numbered point
      const numberedMatch = line.match(/^(\d+)\.\s*(.*)/);
      if (numberedMatch) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${numberedMatch[1]}. `, bold: true }),
              new TextRun({ text: numberedMatch[2] })
            ],
            spacing: { after: 100 }
          })
        );
        return;
      }
      
      // Check if it's a bulleted point
      const bulletMatch = line.match(/^[•*-]\s*(.*)/);
      if (bulletMatch) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({ text: "• ", bold: true }),
              new TextRun({ text: bulletMatch[1] })
            ],
            spacing: { after: 100 }
          })
        );
        return;
      }
      
      // Regular paragraph
      paragraphs.push(
        new Paragraph({
          text: line,
          spacing: { after: 100 }
        })
      );
    });
    
    return paragraphs;
  };

  console.log("Rendering with state:", state);
  console.log("post_improvement_suggestions:", state.contentData?.post_improvement_suggestions);

  return (
    <div className="min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 animate-slideUp">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-brand-primary border-b pb-4">Upload Content for Analysis</h2>
          
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Form Section */}
            <div className="xl:w-1/3">
              <div className="mb-6">
                <label className="form-label">Upload Content File</label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*,video/*"
                    className="block w-full text-brand-text text-sm bg-white cursor-pointer file:cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-brand-primary file:hover:bg-brand-light file:text-white file:rounded-lg mt-1 border border-gray-200 rounded-lg"
                  />
                </div>
                {file && (
                  <p className="mt-2 text-sm text-brand-primary flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    File selected: {file.name}
                  </p>
                )}
              </div>

              <div className="mb-5">
                <label className="form-label">Brand <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    type="text"
                    className="form-input"
                    name="brand"
                    placeholder="Enter your brand"
                    onChange={handleInputChange}
                    value={formData.brand}
                    required
                  />
                  <div className="input-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <label className="form-label">Campaign Objective <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    type="text"
                    className="form-input"
                    name="campaign_type"
                    placeholder="Enter Campaign Type"
                    onChange={handleInputChange}
                    value={formData.campaign_type}
                  />
                  <div className="input-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <label className="form-label">Explain the objective in brief</label>
                <div className="relative">
                  <input
                    type="text"
                    className="form-input"
                    name="objective"
                    placeholder="Enter Objective"
                    onChange={handleInputChange}
                    value={formData.objective}
                  />
                  <div className="input-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                      <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <label className="form-label">Caption</label>
                <div className="relative">
                  <input
                    type="text"
                    className="form-input"
                    name="caption"
                    placeholder="Enter Caption"
                    onChange={handleInputChange}
                    value={formData.caption}
                  />
                  <div className="input-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="form-label">Hashtags</label>
                <div className="relative">
                  <input
                    type="text"
                    className="form-input"
                    name="hashtags"
                    placeholder="Enter Hashtags"
                    onChange={handleInputChange}
                    value={formData.hashtags}
                  />
                  <div className="input-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path fillRule="evenodd" d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.938l1-4H9.031z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="form-label">Brand Guidelines</label>
                <div className="relative">
                  <textarea
                    className="form-input !pl-3 min-h-[100px]"
                    name="brandGuidelines"
                    placeholder="Enter brand guidelines"
                    onChange={handleInputChange}
                    value={formData.brandGuidelines}
                  ></textarea>
                </div>
              </div>

              <div className="mb-6">
                <label className="form-label">Website Link</label>
                <div className="relative">
                  <input
                    type="text"
                    className="form-input"
                    name="websiteLink"
                    placeholder="Enter Website Link"
                    onChange={handleInputChange}
                    value={formData.websiteLink}
                  />
                  <div className="input-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <label className="form-label">Content Type</label>
                <div className="relative">
                  <input
                    type="text"
                    className="form-input"
                    name="contentType"
                    placeholder="Enter Content Type"
                    onChange={handleInputChange}
                    value={formData.contentType}
                  />
                  <div className="input-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  className="btn-primary w-full py-3 text-center"
                  onClick={handleFileUpload}
                  disabled={state.loading}
                >
                  {state.loading ? (
                    <div className="flex items-center justify-center">
                      <div className="rotating-loader-small mr-2">
                        <div className="circle-small"></div>
                      </div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    "Analyze Content"
                  )}
                </button>
              </div>
              
              <div className="mt-4">
                <button
                  className="w-full py-3 text-center border-2 border-brand-primary text-brand-primary rounded-lg hover:bg-brand-primary hover:text-white transition-colors flex items-center justify-center gap-2"
                  onClick={() => {
                    setFile(null);
                    setFormData({
                      brand: "",
                      campaign_type: "",
                      objective: "",
                      caption: "",
                      hashtags: "",
                      brandGuidelines: "",
                      websiteLink: "",
                      contentType: "",
                    });
                    setState({
                      loading: false,
                      contentData: null,
                      contentType: null,
                    });
                  }}
                  disabled={state.loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh Form
                </button>
              </div>
            </div>

            {/* Results Section */}
            <div className="xl:w-2/3 xl:pl-8 mt-8 xl:mt-0">
              {state.loading ? (
                <div className="flex flex-col items-center justify-center h-96">
                  <div className="rotating-loader mb-4">
                    <div className="circle"></div>
                  </div>
                  <p className="text-lg text-brand-primary">Analyzing your content...</p>
                </div>
              ) : state.contentData ? (
                <div className="content-display">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-brand-primary">Analysis Results</h3>
                    <button
                      onClick={downloadAsDocx}
                      className="flex items-center text-sm bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-light transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download as Document
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    {/* Score Card */}
                    <div className="bg-brand-background rounded-lg p-8 shadow-sm">
                      <h4 className="text-lg font-semibold text-brand-primary mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Content Score
                      </h4>
                      <div className="flex items-end mb-6">
                        <span className="text-6xl font-bold text-brand-primary">
                          <AnimatedScore 
                            score={state.contentData?.suggestions?.score?.value || 
                            state.contentData?.suggestions?.score || "N/A"}
                          />
                        </span>
                        <span className="ml-2 text-xl text-gray-500 mb-2">/100</span>
                      </div>
                      {state.contentData?.suggestions?.score?.reasoning && (
                        <div className="mt-4 text-sm text-brand-text score-reasoning">
                          <div dangerouslySetInnerHTML={{
                            __html: formatScoreReasoning(state.contentData.suggestions.score.reasoning)
                          }} />
                        </div>
                      )}
                    </div>

                    {/* Overall Feedback Card */}
                    {state.contentData?.overall_feedback && (
                      <div className="bg-brand-background rounded-lg p-6 shadow-sm">
                        <h4 className="text-lg font-semibold text-brand-primary mb-2 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                          Overall Feedback
                        </h4>
                        <p className="text-sm text-brand-text">
                          {typeof state.contentData.overall_feedback === "object"
                            ? state.contentData.overall_feedback.text
                            : state.contentData.overall_feedback}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-brand-primary mb-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                      </svg>
                      Detailed Analysis
                    </h4>

                    <div className="bg-brand-background rounded-lg p-6 shadow-sm mb-4">
                      <h5 className="font-medium text-brand-primary mb-2">Description Suggestions</h5>
                      <p className="text-brand-text text-sm">
                        {state.contentData?.suggestions?.description?.suggested_description ||
                          state.contentData?.suggestions?.description?.revised_description ||
                          state.contentData?.suggestions?.description?.improved_description ||
                          state.contentData?.description_suggestions ||
                          `No description suggestions provided for this ${state.contentType || "content"}`}
                      </p>
                      {state.contentData?.suggestions?.description?.reasoning && (
                        <div className="mt-2 text-xs text-gray-600 bg-gray-100 p-2 rounded">
                          <strong>Reasoning:</strong> {state.contentData?.suggestions?.description?.reasoning}
                        </div>
                      )}
                    </div>

                    <div className="bg-brand-background rounded-lg p-6 shadow-sm mb-4">
                      <h5 className="font-medium text-brand-primary mb-2">Hashtag Suggestions</h5>
                      <p className="text-brand-text text-sm">
                        {Array.isArray(state.contentData?.suggestions?.hashtags?.suggested_hashtags)
                          ? state.contentData?.suggestions?.hashtags?.suggested_hashtags.join(", ")
                          : typeof state.contentData?.suggestions?.hashtags?.suggested_hashtags === "string"
                          ? state.contentData?.suggestions?.hashtags?.suggested_hashtags
                          : `No hashtag suggestions provided for this ${state.contentType || "content"}`}
                      </p>
                      {state.contentData?.suggestions?.hashtags?.reasoning && (
                        <div className="mt-2 text-xs text-gray-600 bg-gray-100 p-2 rounded">
                          <strong>Reasoning:</strong> {state.contentData?.suggestions?.hashtags?.reasoning}
                        </div>
                      )}
                    </div>

                    <div className="bg-brand-background rounded-lg p-6 shadow-sm">
                      <h5 className="font-medium text-brand-primary mb-2">Improvement Suggestions</h5>
                      <div className="space-y-2 text-brand-text text-sm">
                        {Array.isArray(state.contentData?.suggestions?.post_improvements?.suggested_changes) ? (
                          state.contentData?.suggestions?.post_improvements?.suggested_changes.map((item, idx) => (
                            <div key={idx} className="border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                              <p>
                                <strong>{item.element && `${item.element}: `}</strong>
                                {item.change || item.improvement || item.suggestion || "No suggestion"}
                              </p>
                              {item.reasoning && (
                                <div className="mt-1 text-xs text-gray-600 bg-gray-100 p-2 rounded">
                                  <strong>Reasoning:</strong> {item.reasoning}
                                </div>
                              )}
                            </div>
                          ))
                        ) : state.contentData?.post_improvement_suggestions?.image_feedback ||
                          state.contentData?.post_improvement_suggestions?.suggestion ||
                          state.contentData?.post_improvement_suggestions?.improvement ? (
                          <div>
                            <p>
                              <strong>
                                {state.contentData?.post_improvement_suggestions?.element &&
                                  `${state.contentData?.post_improvement_suggestions?.element}: `}
                              </strong>
                              {state.contentData?.post_improvement_suggestions?.image_feedback ||
                                state.contentData?.post_improvement_suggestions?.suggestion ||
                                state.contentData?.post_improvement_suggestions?.improvement}
                            </p>
                            {state.contentData?.post_improvement_suggestions?.reasoning && (
                              <div className="mt-1 text-xs text-gray-600 bg-gray-100 p-2 rounded">
                                <strong>Reasoning:</strong> {state.contentData?.post_improvement_suggestions?.reasoning}
                              </div>
                            )}
                          </div>
                        ) : (
                          <p>{`No improvement suggestions provided for this ${state.contentType || "content"}`}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 border-dashed rounded-xl flex flex-col items-center justify-center p-10 h-full">
                  <div className="w-20 h-20 bg-brand-background rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-brand-primary mb-2">Upload Content to Analyze</h3>
                  <p className="text-center text-gray-500 max-w-md">
                    Upload your content, fill in the details, and get AI-powered insights to improve your social media performance.
                  </p>
                </div>
              )}

              {state.contentData && (
                <button
                  onClick={() => {
                    // Format all relevant analysis data for the output field
                    let analysisOutput = "";
                    
                    // Add basic info about the content
                    analysisOutput += `Brand: ${formData.brand}\n`;
                    analysisOutput += `Campaign Type: ${formData.campaign_type}\n`;
                    if (formData.objective) analysisOutput += `Objective: ${formData.objective}\n\n`;
                    
                    // Add Content Score
                    if (state.contentData?.suggestions?.score?.value || state.contentData?.suggestions?.score) {
                      analysisOutput += `CONTENT SCORE\n`;
                      analysisOutput += `${state.contentData?.suggestions?.score?.value || state.contentData?.suggestions?.score}\n`;
                      analysisOutput += `/100\n`;
                      
                      if (state.contentData?.suggestions?.score?.reasoning) {
                        analysisOutput += `${state.contentData.suggestions.score.reasoning}\n`;
                      }
                      analysisOutput += `\n`;
                    }
                    
                    // Add overall feedback
                    if (state.contentData.overall_feedback) {
                      analysisOutput += `OVERALL FEEDBACK\n`;
                      analysisOutput += `${typeof state.contentData.overall_feedback === "object" 
                        ? state.contentData.overall_feedback.text 
                        : state.contentData.overall_feedback}\n\n`;
                    }
                    
                    // Add Detailed Analysis header
                    analysisOutput += `DETAILED ANALYSIS\n\n`;
                    
                    // Add Description Suggestions
                    analysisOutput += `Description Suggestions\n`;
                    analysisOutput += `${state.contentData?.suggestions?.description?.suggested_description ||
                      state.contentData?.suggestions?.description?.revised_description ||
                      state.contentData?.suggestions?.description?.improved_description ||
                      state.contentData?.description_suggestions ||
                      `No description suggestions provided for this ${state.contentType || "content"}`}\n\n`;
                    
                    if (state.contentData?.suggestions?.description?.reasoning) {
                      analysisOutput += `Reasoning: ${state.contentData.suggestions.description.reasoning}\n\n`;
                    }
                    
                    // Add Hashtag Suggestions
                    analysisOutput += `Hashtag Suggestions\n`;
                    analysisOutput += `${Array.isArray(state.contentData?.suggestions?.hashtags?.suggested_hashtags)
                      ? state.contentData.suggestions.hashtags.suggested_hashtags.join(", ")
                      : typeof state.contentData?.suggestions?.hashtags?.suggested_hashtags === "string"
                      ? state.contentData.suggestions.hashtags.suggested_hashtags
                      : `No hashtag suggestions provided for this ${state.contentType || "content"}`}\n\n`;
                    
                    if (state.contentData?.suggestions?.hashtags?.reasoning) {
                      analysisOutput += `Reasoning: ${state.contentData.suggestions.hashtags.reasoning}\n\n`;
                    }
                    
                    // Add Improvement Suggestions
                    analysisOutput += `Improvement Suggestions\n`;
                    
                    if (Array.isArray(state.contentData?.suggestions?.post_improvements?.suggested_changes)) {
                      state.contentData.suggestions.post_improvements.suggested_changes.forEach((item, idx) => {
                        analysisOutput += `${idx + 1}. ${item.element ? `${item.element}: ` : ''}${item.change || item.improvement || item.suggestion || "No suggestion"}\n`;
                        if (item.reasoning) {
                          analysisOutput += `   Reasoning: ${item.reasoning}\n`;
                        }
                        analysisOutput += '\n';
                      });
                    } else if (state.contentData?.post_improvement_suggestions?.image_feedback ||
                      state.contentData?.post_improvement_suggestions?.suggestion ||
                      state.contentData?.post_improvement_suggestions?.improvement) {
                      
                      analysisOutput += `${state.contentData?.post_improvement_suggestions?.element ? 
                        `${state.contentData?.post_improvement_suggestions?.element}: ` : ''}${
                        state.contentData?.post_improvement_suggestions?.image_feedback ||
                        state.contentData?.post_improvement_suggestions?.suggestion ||
                        state.contentData?.post_improvement_suggestions?.improvement}\n`;
                      
                      if (state.contentData?.post_improvement_suggestions?.reasoning) {
                        analysisOutput += `Reasoning: ${state.contentData?.post_improvement_suggestions?.reasoning}\n\n`;
                      }
                    } else {
                      analysisOutput += `No improvement suggestions provided for this ${state.contentType || "content"}\n\n`;
                    }
                    
                    // Store only the output field in localStorage
                    localStorage.setItem('contentAnalysisResults', JSON.stringify({
                      output: analysisOutput
                    }));
                    
                    window.location.href = '/feedback';
                  }}
                  className="mt-4 bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-light transition-colors"
                >
                  Go to Feedback
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .loading-icon {
          width: 100%;
          height: 100%;
          animation: spin 1.5s linear infinite;
        }

        .loading-path {
          opacity: 0.3;
        }

        .loading-highlight {
          opacity: 1;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-dots {
          display: inline-block;
          animation: dots 1.5s infinite;
        }

        @keyframes dots {
          0%, 20% { content: '.'; }
          40% { content: '..'; }
          60%, 100% { content: '...'; }
        }
        
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

        .circle:nth-child(2) {
          width: 60px;
          height: 60px;
          border: 6px solid #6A1B9A;
          border-top: 6px solid #AB47BC;
          animation: spin 1.5s linear infinite reverse;
        }

        .circle:nth-child(3) {
          width: 40px;
          height: 40px;
          border: 4px solid #8E24AA;
          border-top: 4px solid #CE93D8;
          animation: spin 2s linear infinite;
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

        .score-reasoning p {
          margin-bottom: 1.25rem;
          padding-left: 2rem;
          position: relative;
          line-height: 1.8;
          font-size: 0.95rem;
        }

        .score-reasoning p:before {
          content: "•";
          position: absolute;
          left: 0.75rem;
          color: #3D155D;
          font-weight: bold;
          font-size: 1.5rem;
          line-height: 1;
          top: 2px;
        }

        .score-reasoning .point-value {
          color: #3D155D;
          font-weight: 600;
          background: rgba(61, 21, 93, 0.08);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          margin-right: 0.5rem;
          display: inline-block;
        }

        .score-reasoning .text-brand-primary {
          color: #3D155D;
          font-weight: 600;
          padding: 0 0.25rem;
          background: rgba(61, 21, 93, 0.05);
          border-radius: 4px;
        }

        .score-reasoning strong {
          font-weight: 600;
          color: #3D155D;
        }

        .score-reasoning .mb-2:last-child {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
};

export default Content;
