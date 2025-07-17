// "use client";
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import usePlacesAutocomplete from "use-places-autocomplete";

// export default function LocationForm() {
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);

//   const [selectedCountry, setSelectedCountry] = useState("");
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedCity, setSelectedCity] = useState("");

//   const {
//     ready,
//     value,
//     suggestions: { status, data },
//     setValue,
//     clearSuggestions,
//   } = usePlacesAutocomplete({
//     requestOptions: {
//       componentRestrictions: { country: "pk" },
//     },
//     debounce: 300,
//   });

//   useEffect(() => {
//     axios.get("https://countriesnow.space/api/v0.1/countries/positions")
//       .then((res) => {
//         setCountries(res.data.data);
//       });
//   }, []);

//   const fetchStates = async (country) => {
//     setSelectedCountry(country);
//     const res = await axios.post("https://countriesnow.space/api/v0.1/countries/states", { country });
//     setStates(res.data.data.states);
//     setCities([]);
//     setSelectedState("");
//     setSelectedCity("");
//   };

//   const fetchCities = async (state) => {
//     setSelectedState(state);
//     const res = await axios.post("https://countriesnow.space/api/v0.1/countries/state/cities", {
//       country: selectedCountry,
//       state
//     });
//     setCities(res.data.data);
//   };

//   const handleCityChange = (city) => {
//     setSelectedCity(city);
//     setValue(""); // reset address
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
//       <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-xl transition-all duration-300">
//         <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
//           Choose Your Location
//         </h2>

//         {/* Country Dropdown */}
//         <div className="mb-6">
//           <label className="block mb-2 font-semibold text-gray-700">Country</label>
//           <select
//             onChange={(e) => fetchStates(e.target.value)}
//             className="w-full px-4 py-3.5 border border-gray-300 rounded-xl shadow-md"
//             defaultValue=""
//           >
//             <option disabled value="">Select Country</option>
//             {countries.map((c) => (
//               <option key={c.name} value={c.name}>{c.name}</option>
//             ))}
//           </select>
//         </div>

//         {/* State Dropdown */}
//         {selectedCountry && (
//           <div className="mb-6">
//             <label className="block mb-2 font-semibold text-gray-700">State / Province</label>
//             <select
//               onChange={(e) => fetchCities(e.target.value)}
//               className="w-full px-4 py-3.5 border border-gray-300 rounded-xl shadow-md"
//               defaultValue=""
//             >
//               <option disabled value="">Select State</option>
//               {states.map((s) => (
//                 <option key={s.name} value={s.name}>{s.name}</option>
//               ))}
//             </select>
//           </div>
//         )}

//         {/* City Dropdown */}
//         {selectedState && (
//           <div className="mb-6">
//             <label className="block mb-2 font-semibold text-gray-700">City</label>
//             <select
//               onChange={(e) => handleCityChange(e.target.value)}
//               className="w-full px-4 py-3.5 border border-gray-300 rounded-xl shadow-md"
//               defaultValue=""
//             >
//               <option disabled value="">Select City</option>
//               {cities.map((city) => (
//                 <option key={city} value={city}>{city}</option>
//               ))}
//             </select>
//           </div>
//         )}

//         {/* Google Address Field (after city) */}
//       {selectedCity && ready && (
//   <div className="mb-6">
//     <label className="block mb-2 font-semibold text-gray-700">Address / Area</label>
//     <input
//       value={value}
//       onChange={(e) => setValue(e.target.value)}
//       placeholder="Type your street, area, or landmark..."
//       className="w-full px-4 py-3.5 border border-gray-300 rounded-xl shadow-md"
//     />
//     {status === "OK" && (
//       <ul className="bg-white border mt-2 rounded-xl shadow-md max-h-48 overflow-y-auto">
//         {data.map(({ description }, index) => (
//           <li
//             key={index}
//             className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
//             onClick={() => {
//               setValue(description, false);
//               clearSuggestions();
//             }}
//           >
//             {description}
//           </li>
//         ))}
//       </ul>
//     )}
//   </div>
// )}

//       </div>
//     </div>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import usePlacesAutocomplete from "use-places-autocomplete";

export default function LocationForm() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "pk" }, // Change if needed
    },
    debounce: 300,
  });

  useEffect(() => {
    axios
      .get("https://countriesnow.space/api/v0.1/countries/positions")
      .then((res) => {
        setCountries(res.data.data);
      });
  }, []);

  const fetchStates = async (country) => {
    setSelectedCountry(country);
    const res = await axios.post(
      "https://countriesnow.space/api/v0.1/countries/states",
      { country }
    );
    setStates(res.data.data.states);
    setCities([]);
    setSelectedState("");
    setSelectedCity("");
  };

  const fetchCities = async (state) => {
    setSelectedState(state);
    const res = await axios.post(
      "https://countriesnow.space/api/v0.1/countries/state/cities",
      { country: selectedCountry, state }
    );
    setCities(res.data.data);
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
    setValue("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-xl transition-all duration-300">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
          Choose Your Location
        </h2>

        {/* Country */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold text-gray-700">Country</label>
          <select
            onChange={(e) => fetchStates(e.target.value)}
            className="w-full px-4 py-3.5 border border-gray-300 rounded-xl shadow-md"
            defaultValue=""
          >
            <option disabled value="">
              Select Country
            </option>
            {countries.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* State */}
        {selectedCountry && (
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-700">State / Province</label>
            <select
              onChange={(e) => fetchCities(e.target.value)}
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl shadow-md"
              defaultValue=""
            >
              <option disabled value="">
                Select State
              </option>
              {states.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* City */}
        {selectedState && (
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-700">City</label>
            <select
              onChange={(e) => handleCityChange(e.target.value)}
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl shadow-md"
              defaultValue=""
            >
              <option disabled value="">
                Select City
              </option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Google Address / Area */}
        {selectedCity && ready && (
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-700">Address / Area</label>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Type your area, building, etc."
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl shadow-md"
            />
            {status === "OK" && (
              <ul className="bg-white border mt-2 rounded-xl shadow-md max-h-48 overflow-y-auto">
                {data.map(({ description }, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                    onClick={() => {
                      setValue(description, false);
                      clearSuggestions();
                    }}
                  >
                    {description}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
