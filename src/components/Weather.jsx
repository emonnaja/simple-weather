import { useEffect, useState } from "react";
import "./Weather.css";
import search_icon from "../assets/search.png";
import clear_sky from "../assets/clear.png";
import cloud_sky from "../assets/cloud.png";
import rain_sky from "../assets/rain.png";
import snow_sky from "../assets/snow.png";
import humidity from "../assets/humidity.png";
import drizzle from "../assets/drizzle.png";
import wind from "../assets/wind.png";

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("");
  const apiKey = `${import.meta.env.VITE_WEATHER_API_KEY}`;

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("Geolocation tidak didukung oleh browser ini.");
      setLoading(false);
    }
  }, []);

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    fetchWeather(latitude, longitude);
  };

  const fetchWeather = (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Weather data:", data);
        setWeatherData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setLoading(false);
      });
  };

  const fetchWeatherByCity = (city) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Weather data:", data);
        setWeatherData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setLoading(false);
      });
  };

  const error = (err) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    setLoading(false);
  };

  // Menentukan gambar cuaca berdasarkan deskripsi
  const getWeatherIcon = (description) => {
    if (description.includes("clear")) {
      return clear_sky;
    } else if (description.includes("cloud")) {
      return cloud_sky;
    } else if (description.includes("rain")) {
      return rain_sky;
    } else if (description.includes("snow")) {
      return snow_sky;
    } else if (description.includes("drizzle")) {
      return drizzle;
    } else {
      return clear_sky; // Default icon
    }
  };

  const handleSearch = () => {
    if (city) {
      setLoading(true);
      fetchWeatherByCity(city);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="weather">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search location"
          value={city}
          onKeyDown={handleKeyPress}
          onChange={(e) => setCity(e.target.value)}
        />
        <img src={search_icon} alt="" onClick={handleSearch} />
      </div>
      <div className="container">
        {weatherData && (
          <>
            <div className="main-data">
              <img
                src={getWeatherIcon(weatherData.weather[0].description)}
                alt=""
                className="weather-icon"
              />
              <p className="details">
                {weatherData.main.temp_min}&deg;/{weatherData.main.temp_max}
                &deg; feels like {weatherData.main.feels_like}&deg;
              </p>
              <p className="temperature">{weatherData.main.temp}&deg;C</p>
              <p className="city">{weatherData.name}</p>
            </div>
            <div className="weather-data">
              <div className="col">
                <img src={humidity} alt="" className="humidity-icon" />
                <p>{weatherData.main.humidity}&#37;</p>
                <span>Humidity</span>
              </div>{" "}
              <div className="col">
                <img src={wind} alt="" className="wind-icon" />
                <p>{weatherData.wind.speed} Km/h</p>
                <span>Wind</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Weather;
