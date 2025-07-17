"use client";

import { useState } from "react";

export default function AutoDetectLocation() {
  const [coords, setCoords] = useState(null);
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });

        fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyC3BD8myk_jQaU99c3UgOGj6RNPb37949U`
        )
          .then((res) => res.json())
          .then((data) => {
            console.log(data, " Location data fetched successfully.");
            const addressComponents = data.results[0].address_components;

            const countryObj = addressComponents.find((c) =>
              c.types.includes("country")
            );
            const provinceObj = addressComponents.find((c) =>
              c.types.includes("administrative_area_level_1")
            );
            const cityObj = addressComponents.find((c) =>
              c.types.includes("locality")
            );

            setCountry(countryObj?.long_name || "");
            setProvince(provinceObj?.long_name || "");
            setCity(cityObj?.long_name || "");
            setAddress(data.results[0].formatted_address);
          })
          .catch((err) => {
            setError("Location fetch failed.");
          });
      },
      () => {
        setError("Unable to retrieve your location.");
      }
    );
  };

  return (
    <main className="flex mt-14 flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-white p-6 gap-6">
      <h1 className="text-4xl font-bold text-blue-700 animate-fade-in-down">
        Auto‑Detect Location
      </h1>

      {!coords && (
        <button
          onClick={handleGetLocation}
          className="px-6 py-3 cursor-pointer bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 animate-bounce"
        >
          Allow Location Access
        </button>
      )}

      {/* Country Dropdown */}
      {country && (
        <div className="w-full max-w-md animate-slide-up">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Country
          </label>
          <select
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setProvince("");
              setCity("");
              setAddress("");
            }}
            className="w-full bg-white border border-gray-300 px-2 py-3 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value={country}>{country}</option>
          </select>
        </div>
      )}

      {/* Province Dropdown */}
      {province && (
        <div className="w-full max-w-md animate-slide-up">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Province / State
          </label>
          <select
            value={province}
            onChange={(e) => {
              setProvince(e.target.value);
              setCity("");
              setAddress("");
            }}
            className="w-full bg-white border border-gray-300 px-2 py-3 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value={province}>{province}</option>
          </select>
        </div>
      )}

      {/* City Dropdown */}
      {city && (
        <div className="w-full max-w-md animate-slide-up">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            City
          </label>
          <select
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setAddress("");
            }}
            className="w-full bg-white border border-gray-300 px-2 py-3 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value={city}>{city}</option>
          </select>
        </div>
      )}

      {/* Address Card */}
      {address && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-md text-center max-w-md animate-fade-in">
          <p className="text-blue-700 text-2xl font-bold mb-2"> Full Address</p>
          <p className="text-gray-700 text-base">{address}</p>
        </div>
      )}

      {/* Error */}
      {error && <p className="text-red-600 font-medium">{error}</p>}
    </main>
  );
}
