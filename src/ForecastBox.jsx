// src/ForecastBox.jsx
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import AcUnitIcon from "@mui/icons-material/AcUnit";

export default function ForecastBox({ forecast }) {
  if (!forecast || forecast.length === 0) return null;

  return (
    <div style={{
      display: "flex",
      gap: "12px",
      justifyContent: "center",
      flexWrap: "wrap",
      marginTop: "20px",
      zIndex: 1,
      position: 'relative'
    }}>
      {forecast.map((day, idx) => (
        <Card key={idx} sx={{
          width: 150,
          textAlign: "center",
          backgroundColor: 'rgba(0,0,0,0.25)',
          color: '#fff',
          backdropFilter: 'blur(6px)',
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
            </Typography>
            <div>
              {day.main.toLowerCase().includes("rain") ? (
                <ThunderstormIcon />
              ) : day.tempMax > 15 ? (
                <WbSunnyIcon />
              ) : (
                <AcUnitIcon />
              )}
            </div>
            <Typography variant="body2">
              {Math.round(day.tempMin)}°C / {Math.round(day.tempMax)}°C
            </Typography>
            <Typography variant="caption" display="block">
              {day.description}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
