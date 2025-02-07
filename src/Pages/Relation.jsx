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
    <div className="bg-slate-100 h-[100vh] overflow-hidden py-20 px-8">
      <h1 className="text-4xl text-center mb-6 mt-2 font-bold uppercase">
        Performance <span className="capitalize text-xl">under development</span>
      </h1>
      <div className="flex flex-col xl:flex-row">
        <div className="xl:border-r-2 w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 max-sm:gap-7 items-center xl:w-1/3 h-full border-slate-700">
          <div class="w-full max-w-sm min-w-[200px] relative mt-4">
            <label class="block mb-2 text-sm text-slate-600">Age Group</label>

            <div class="relative">
              <input
                type="number"
                class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pr-3 pl-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-700 hover:border-slate-500 shadow-sm focus:shadow"
                name="age_group"
                placeholder="Enter Age Group"
                onChange={handleChange}
                value={formData.age_group}
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
            <label class="block mb-2 text-sm text-slate-600">Region</label>

            <div class="relative">
              <input
                type="number"
                class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pr-3 pl-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-700 hover:border-slate-500 shadow-sm focus:shadow"
                name="region"
                placeholder="Enter Region"
                onChange={handleChange}
                value={formData.region}
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
            <label class="block mb-2 text-sm text-slate-600">Month</label>

            <div class="relative">
              <input
                type="number"
                class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pr-3 pl-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-700 hover:border-slate-500 shadow-sm focus:shadow"
                name="month"
                placeholder="Enter your Month"
                onChange={handleChange}
                value={formData.month}
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
              Amount Spent
            </label>

            <div class="relative">
              <input
                type="number"
                class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pr-3 pl-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-700 hover:border-slate-500 shadow-sm focus:shadow"
                name="amount_spent"
                placeholder="Enter Amount Spent"
                onChange={handleChange}
                value={formData.amount_spent}
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
          <button
            className="rounded-md w-32 bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none mt-6"
            onClick={handleSubmit}
            disabled={
              !formData.age_group ||
              !formData.region ||
              !formData.month ||
              !formData.amount_spent
            }
          >
            Submit
          </button>
        </div>
        <div className="w-full mt-10 xl:mt-0 xl:w-2/3 flex px-5 justify-center items-center">
          {loading ? (
            <ClimbingBoxLoader size={40} color="#5d5d5d" />
          ) : contentData ? (
            <div>
              <div className="flex mt-5">
                {contentData.map((item, index) => (
                  <>
                    <div>
                      <h1 className="text-2xl font-bold">{index === 1 ? "Impressions:" : "Reach:"}</h1>
                    </div>
                    <div className="bg-slate-300 rounded-lg shadow-md hover:scale-125 transition-all px-6 py-3 mx-5" key={index}>
                      <h1 className="text-2xl font-bold">{item}</h1>
                    </div>
                  </>
                ))}
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

export default Relation;
