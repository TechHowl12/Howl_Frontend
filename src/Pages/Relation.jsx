import React, { useState } from "react";
import axios from "axios";
import { ClimbingBoxLoader } from "react-spinners";

const Relation = () => {
  const [loading, setLoading] = useState(false);
  const [contentData, setContentData] = useState(null);
  const [formData, setFormData] = useState({
    age_group: 0,
    region: 0,
    month: 0,
    amount_spent: 0.0,
  });

  // Function to update state with input values
  const handleChange = (e) => {
    const { name, value } = e.target;
    let convertedValue = value;

    // Convert value to number if it is age_group, region, or month; to float for amount_spent
    if (name === "amount_spent") {
      convertedValue = parseFloat(value);
    } else {
      convertedValue = parseInt(value, 10);
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: convertedValue,
    }));
  };

  // Function to post data to the endpoint
  const handleSubmit = async () => {
    if (!formData) {
      alert("Please fill up all the fields");
    }
    try {
      setLoading(true);
      const response = await axios.post(
        "https://howl-performanceapi.onrender.com/performance",
        formData
      );
      setContentData(response.data.age_model);
      setLoading(false);
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Failed to submit data");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 animate-slideUp">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-brand-primary border-b pb-4">
            Performance Analytics
          </h2>
          
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Form Section */}
            <div className="xl:w-1/3 border-r border-gray-200 pr-8 mb-[10px]">
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-brand-primary">Age Group</label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full bg-transparent placeholder:text-gray-400 text-gray-700 text-sm border border-gray-200 rounded-md pr-3 pl-10 py-2 transition duration-300 ease focus:outline-none focus:border-brand-primary hover:border-gray-300 shadow-sm focus:shadow"
                    name="age_group"
                    placeholder="Enter Age Group"
                    onChange={handleChange}
                    value={formData.age_group}
                    required
                  />
                  <div className="absolute left-1 top-1 rounded bg-brand-primary p-1.5 text-white">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      className="w-4 h-4"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-brand-primary">Region</label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full bg-transparent placeholder:text-gray-400 text-gray-700 text-sm border border-gray-200 rounded-md pr-3 pl-10 py-2 transition duration-300 ease focus:outline-none focus:border-brand-primary hover:border-gray-300 shadow-sm focus:shadow"
                    name="region"
                    placeholder="Enter Region"
                    onChange={handleChange}
                    value={formData.region}
                    required
                  />
                  <div className="absolute left-1 top-1 rounded bg-brand-primary p-1.5 text-white">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      className="w-4 h-4"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-brand-primary">Month</label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full bg-transparent placeholder:text-gray-400 text-gray-700 text-sm border border-gray-200 rounded-md pr-3 pl-10 py-2 transition duration-300 ease focus:outline-none focus:border-brand-primary hover:border-gray-300 shadow-sm focus:shadow"
                    name="month"
                    placeholder="Enter Month"
                    onChange={handleChange}
                    value={formData.month}
                    required
                  />
                  <div className="absolute left-1 top-1 rounded bg-brand-primary p-1.5 text-white">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      className="w-4 h-4"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-brand-primary">Amount Spent</label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full bg-transparent placeholder:text-gray-400 text-gray-700 text-sm border border-gray-200 rounded-md pr-3 pl-10 py-2 transition duration-300 ease focus:outline-none focus:border-brand-primary hover:border-gray-300 shadow-sm focus:shadow"
                    name="amount_spent"
                    placeholder="Enter Amount Spent"
                    onChange={handleChange}
                    value={formData.amount_spent}
                    required
                  />
                  <div className="absolute left-1 top-1 rounded bg-brand-primary p-1.5 text-white">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      className="w-4 h-4"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <button
                className="btn-primary px-6 py-3 mt-4"
                onClick={handleSubmit}
                disabled={
                  !formData.age_group ||
                  !formData.region ||
                  !formData.month ||
                  !formData.amount_spent
                }
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <span className="ml-2">Processing...</span>
                  </div>
                ) : (
                  "Submit"
                )}
              </button>
            </div>

            {/* Display Section */}
            <div className="xl:w-2/3">
              {loading ? (
                <div className="flex justify-center items-center h-[400px]">
                  <ClimbingBoxLoader size={40} color="#4f46e5" />
                </div>
              ) : contentData ? (
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-brand-primary mb-6 pb-3 border-b border-gray-200">Performance Results</h3>
                  
                  <div className="flex flex-col md:flex-row justify-around gap-6">
                    {contentData.map((item, index) => (
                      <div key={index} className="bg-white rounded-lg p-6 shadow-sm transition-transform hover:scale-105 hover:shadow-md">
                        <h4 className="text-lg font-medium text-brand-primary mb-2">
                          {index === 1 ? "Impressions" : "Reach"}
                        </h4>
                        <p className="text-3xl font-bold text-gray-700">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] bg-gray-50 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-4 text-xl font-medium text-brand-primary">Fill in all the required fields</h3>
                  <p className="mt-2 text-gray-500">Your performance results will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Relation;
