import React, { useEffect, useState } from "react";
import Select from "react-select";

import { ReactComponent as DayIcon } from "../../asset/images/day.svg";
import { ReactComponent as NightIcon } from "../../asset/images/night.svg";

import "./style.css";
interface OptionType {
  value: string;
  label: string;
}

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    temp_max: number;
    temp_min: number;
  };
  weather: {
    description: string;
  }[];
}

interface LocationData {
  latitude: number;
  longitude: number;
}

const API_KEY = "77509e69515c87c5570c15b357de7f56";
const Weather: React.FC = () => {
  const [city, setCity] = useState<string>("");
  const [options, setOptions] = useState<OptionType[]>([]);
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);

  const [mode, setMode] = useState("day");

  const styles = {
    "--background-color": mode === "day" ? "#ffffff" : "#141e30",
    "--backround-image":
      mode === "day"
        ? "url('./../Weather/style.css/images/day.svg')"
        : "url(https://images.unsplash.com/photo-1519680772-3b1b1b1b1b1b?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Mnx8d2VhdGhlciUyMG1lbnV8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80)",
    "--text-color": mode === "day" ? "#1d1d1d" : "#ffffff",
  };
  const Icon = mode === "day" ? DayIcon : NightIcon;
  useEffect(() => {
    const fetchCities = async () => {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/find?q=${city}&type=like&sort=population&cnt=10&appid=${API_KEY}`
      );
      const data = await response.json();
      const options = data.list.map((city: any) => ({
        value: city.name,
        label: `${city.name}, ${city.sys.country}`,
      }));
      setOptions(options);
    };
    if (city.length > 2) {
      fetchCities();
    }
  }, [city]);

  const handleInputChange = (inputValue: string) => {
    setCity(inputValue);
  };

  const handleOptionChange = (selectedOption: OptionType | null) => {
    setSelectedOption(selectedOption);
    if (selectedOption) {
      fetchWeatherData(selectedOption.value);
    } else {
      setWeatherData(null);
    }
  };

  const fetchWeatherData = async (city: string) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );
    const data = await response.json();
    setWeatherData(data);
  };

  const handleCurrentLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(fetchWeatherByLocation);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const fetchWeatherByLocation = async (position: any) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setLocationData({ latitude, longitude });
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
    );
    const data = await response.json();
    console.log(data);
    setWeatherData(data);
  };

  return (
    <div
      className="weather-app"
      style={{
        backgroundColor: styles["--background-color"],
        backgroundImage: styles["--backround-image"],
        color: styles["--text-color"],
      }}
    >
      <div className="wrapper">
 <header>
        <h1>Weather App</h1>
        <label>
          <input
            type="checkbox"
            className="checkbox"
            checked={mode === "night"}
            onChange={(e) => setMode(e.target.checked ? "night" : "day")}
          />
          <span className="toggle-icon">
            <Icon />
          </span>
        </label>
      </header>
       <main
        style={{
          color: mode === "day" ? "#1d1d1d" : "#1d1d1d",
        }}
      >
        <Select
        className="select"
          options={options}
          value={selectedOption}
          onInputChange={handleInputChange}
          onChange={handleOptionChange}
          placeholder="Enter a city"
        />
      </main>
       <button onClick={handleCurrentLocationClick}>Get Current Location</button>
      {weatherData && (
        <div className="weather-info">
          <h2>{weatherData.name}</h2>
          <p>{weatherData.weather[0].description}</p>
          <p>Temperature: {weatherData.main.temp} °C</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Max: {weatherData.main.temp_max}%</p>
          <p>Min: {weatherData.main.temp_min}%</p>
        </div>
      )}
      </div>
     
     
     
    </div>
  );
};

export default Weather;
