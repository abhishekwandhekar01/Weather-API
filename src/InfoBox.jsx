import { useState, useRef, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import Slider from '@mui/material/Slider';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

export default function InfoBox({ info }) {
  if (!info) return null;

  const INIT_URL = "https://images.unsplash.com/photo-1690501882193-0297b5f3f309?w=600&auto=format&fit=crop&q=60";
  const HOT_URL = "https://images.unsplash.com/photo-1544398823-269687d36107?w=600&auto=format&fit=crop&q=60";
  const COLD_URL = "https://images.unsplash.com/photo-1477601263568-180e2c6d046e?w=600&auto=format&fit=crop&q=60";
  const RAIN_URL = "https://images.unsplash.com/photo-1498847559558-1e4b1a7f7a2f?w=600&auto=format&fit=crop&q=60";

  const image = info.humidity > 80 ? RAIN_URL : info.temp > 15 ? HOT_URL : COLD_URL;

  // --- Audio ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);

  let song = '/songs/lovelyday.mp3';
  if (info.humidity > 80) {
    song = '/songs/rain.mp3';
  } else if (info.temp > 15) {
    song = '/songs/lovelyday.mp3';
  } else {
    song = '/songs/softcalm.mp3';
  }

  // Play/pause handler
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  };

  // Volume handler
  const handleVolume = (e, val) => {
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
  };

  // Sync isPlaying state with audio element events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [song]);

  // Set volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // When song changes, reset audio and play if needed
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.src = song;
    audioRef.current.load();
    setIsPlaying(false);
  }, [song]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24, zIndex: 1 }}>
      <Card
        sx={{
          maxWidth: 480,
          minWidth: 360,
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(0,0,0,0.55)',
          borderRadius: 20,
          boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#fff',
          transition: 'transform 0.3s',
          '&:hover': { transform: 'scale(1.03)' },
        }}
      >
        <CardMedia
          sx={{ height: 200, borderTopLeftRadius: 20, borderTopRightRadius: 20, objectFit: 'cover', filter: 'brightness(0.65)' }}
          image={image}
          title={`${info.city} weather`}
        />

        <CardContent>
          <Typography gutterBottom variant="h5" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600 }}>
            {info.city}
            {info.humidity > 80 ? <ThunderstormIcon fontSize="large" /> : info.temp > 15 ? <WbSunnyIcon fontSize="large" /> : <AcUnitIcon fontSize="large" />}
          </Typography>

          <Typography variant="h2" sx={{ fontWeight: 700, marginBottom: 1 }}>
            {Math.round(info.temp)}°C
          </Typography>

          <Typography variant="h6" sx={{ fontStyle: 'italic', marginBottom: 2 }}>
            {info.weather}
          </Typography>

          <div style={{ textAlign: 'left', color: 'rgba(255,255,255,0.95)', lineHeight: 1.6 }}>
            <p>Feels like: <b>{Math.round(info.feelsLike)}°C</b></p>
            <p>Min / Max: {Math.round(info.tempMin)}°C / {Math.round(info.tempMax)}°C</p>
            <p>Humidity: {info.humidity}%</p>
            <p>Pressure: {info.pressure} hPa</p>
            <p>Wind: {info.wind?.speed ?? '-'} m/s</p>
          </div>

          {/* Music Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 20, justifyContent: 'center' }}>
            <button
              onClick={togglePlay}
              style={{
                border: 'none',
                background: isPlaying
                  ? 'linear-gradient(135deg, #ff5858 0%, #f09819 100%)'
                  : 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
                color: '#fff',
                borderRadius: '50%',
                width: 54,
                height: 54,
                cursor: 'pointer',
                boxShadow: isPlaying
                  ? '0 0 12px 2px #ff5858, 0 2px 8px rgba(0,0,0,0.2)'
                  : '0 0 12px 2px #43cea2, 0 2px 8px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s',
              }}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <PauseIcon sx={{ fontSize: 32 }} /> : <PlayArrowIcon sx={{ fontSize: 32 }} />}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '6px 16px' }}>
              <VolumeUpIcon style={{ color: '#fff', fontSize: 28 }} />
              <Slider
                value={volume}
                min={0}
                max={1}
                step={0.01}
                onChange={handleVolume}
                sx={{
                  width: 120,
                  color: '#fff',
                  '& .MuiSlider-thumb': {
                    background: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
                    width: 18,
                    height: 18,
                  },
                  '& .MuiSlider-track': {
                    background: '#43cea2',
                  },
                  '& .MuiSlider-rail': {
                    background: '#185a9d',
                  },
                }}
              />
            </div>

            {/* Conditionally render audio element to force React to recreate it when song changes */}
            {song && (
              <audio
                ref={audioRef}
                src={song}
                preload="auto"
                key={song}
                onLoadedData={() => setIsPlaying(false)}
              >
                <source src={song} type="audio/mp3" />
              </audio>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
