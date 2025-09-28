// src/services/weatherService.js
const API_URL = 'https://api.openweathermap.org/data/2.5';
const KEY = import.meta.env.VITE_OPENWEATHER_KEY;

if (!KEY) {
  console.warn('VITE_OPENWEATHER_KEY is not set. Create a .env file with VITE_OPENWEATHER_KEY=your_key');
}

export async function getWeatherByCity(city) {
  const url = `${API_URL}/weather?q=${encodeURIComponent(city)}&appid=${KEY}&units=metric`;
  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) {
    // data.message comes from OpenWeather (e.g., "city not found")
    throw new Error(data.message || 'Failed to fetch weather');
  }

  return {
    city: data.name,
    temp: data.main.temp,
    tempMin: data.main.temp_min,
    tempMax: data.main.temp_max,
    humidity: data.main.humidity,
    feelsLike: data.main.feels_like,
    weather: data.weather[0].description,
    weatherMain: data.weather[0].main,
    wind: data.wind,
    pressure: data.main.pressure,
    coord: data.coord
  };
}

// Optional helper: fetch forecast by coordinates (we'll expand later)
export async function getForecastByCoords(lat, lon) {
  const url = `${API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${KEY}&units=metric`;
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch forecast');

  // convert list (3h) to daily summary (simple)
  const days = {};
  data.list.forEach(item => {
    const day = item.dt_txt.split(' ')[0];
    if (!days[day]) days[day] = [];
    days[day].push(item);
  });

  const forecast = Object.keys(days).slice(0, 5).map(date => {
    const items = days[date];
    const temps = items.map(i => i.main.temp);
    const desc = items[0].weather[0].description;
    const main = items[0].weather[0].main;
    return {
      date,
      tempMin: Math.min(...temps),
      tempMax: Math.max(...temps),
      description: desc,
      main
    };
  });

  return forecast;
}
