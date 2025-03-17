import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

interface WeatherData {
  name: string;
  sys: { country: string };
  main: { temp: number };
  weather: { description: string; icon: string }[];
}

const WeatherApp: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState<string>("Jakarta"); // Default kota

  const API_KEY = "56fb1ce2b84a614b84bd298fb36f5b72"; // Ganti dengan API Key Anda

  const fetchWeather = async (location: string) => {
    setLoading(true);
    setError(null);
    try {
      const URL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`;
      const response = await axios.get<WeatherData>(URL);
      if (response.status === 200) {
        setWeather(response.data);
      } else {
        throw new Error("Invalid response from API");
      }
    } catch (err) {
      setError("Kota tidak ditemukan. Coba lagi!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city); // Load cuaca pertama kali untuk Jakarta
  }, []);

  const handleSearch = () => {
    if (city.trim() !== "") {
      fetchWeather(city);
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-gradient-to-b from-pink-200 to-pink-400">
      {/* Background Awan */}
      <div className="absolute inset-0 bg-[url('/cute-clouds.png')] bg-cover bg-center opacity-40"></div>

      {/* Card Cuaca */}
      <motion.div
        className="relative z-10 bg-white p-8 rounded-3xl shadow-2xl text-center w-[90%] max-w-md"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-pink-500">🌤️ Weather</h1>

        {/* Search Box */}
        <div className="mt-4 flex justify-center">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-3/4 px-4 py-2 border rounded-l-lg text-gray-700 focus:outline-none"
            placeholder="Cari kota..."
          />
          <button
            onClick={handleSearch}
            className="bg-pink-500 text-white px-4 py-2 rounded-r-lg hover:bg-pink-600 transition"
          >
            🔍
          </button>
        </div>

        {/* Loading & Error */}
        {loading && (
          <p className="mt-4 text-pink-500">Loading...</p>
        )}
        {error && (
          <p className="mt-4 text-red-500">{error}</p>
        )}

        {/* Cuaca Info */}
        {!loading && !error && weather && (
          <>
            <h2 className="text-2xl mt-3 font-semibold text-gray-700">
              {weather.name}, {weather.sys.country}
            </h2>

            <motion.img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="weather icon"
              className="w-32 h-32 mx-auto mt-4"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />

            <p className="text-4xl font-bold mt-4 text-pink-700">
              {weather.main.temp}°C
            </p>
            <p className="text-lg italic mt-2 text-gray-600">
              {weather.weather[0].description}
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default WeatherApp;
