import { useState } from 'react';
import SearchBox from './SearchBox';
import InfoBox from './InfoBox';
import ForecastBox from './ForecastBox';
import { getForecastByCoords } from './services/weatherService';
import './App.css';

const INIT_URL = "https://images.unsplash.com/photo-1690501882193-0297b5f3f309?w=1200&auto=format&fit=crop&q=60";
const HOT_URL = "https://images.unsplash.com/photo-1544398823-269687d36107?w=1200&auto=format&fit=crop&q=60";
const COLD_URL = "https://images.unsplash.com/photo-1477601263568-180e2c6d046e?w=1200&auto=format&fit=crop&q=60";
const RAIN_URL = "https://images.unsplash.com/photo-1498847559558-1e4b1a7f7a2f?w=1200&auto=format&fit=crop&q=60";

function pickBackground(info) {
  return !info ? INIT_URL : info.humidity > 80 ? RAIN_URL : info.temp > 15 ? HOT_URL : COLD_URL;
}

// ...existing code...

export default function WeatherApp() {
  const [weatherInfo, setWeatherInfo] = useState({
    city: "Delhi",
    feelsLike: 35.24,
    temp: 32.33,
    tempMin: 32.33,
    tempMax: 32.33,
    humidity: 51,
    weather: "clear sky",
    weatherMain: "Clear",
    wind: { speed: 0 },
    pressure: 1013,
    coord: { lat: 28.6139, lon: 77.209 },
  });

  const [forecast, setForecast] = useState([]);
  // ...existing code...

  const updateInfo = async (newInfo) => {
    setWeatherInfo(prev => ({ ...prev, ...newInfo }));

    try {
      if (newInfo.coord) {
        const fc = await getForecastByCoords(newInfo.coord.lat, newInfo.coord.lon);
        setForecast(fc);
      }
    } catch (err) {
      console.error("Forecast error:", err);
      setForecast([]);
    }
  };

  const bg = pickBackground(weatherInfo);

  return (
    <div
      className="weather-app"
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 20,
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        transition: "background-image 0.6s ease-in-out",
      }}
    >
      <h2 style={{ color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.6)", marginBottom: "16px" }}>
        Weather Info
      </h2>
      <SearchBox updateInfo={updateInfo} />
      <InfoBox info={weatherInfo} />
      <ForecastBox forecast={forecast} />
      
  {/* ...existing code... */}
    </div>
  );
}
