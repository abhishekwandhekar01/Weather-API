// src/SearchBox.jsx
import React, { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import './SearchBox.css';
import { getWeatherByCity } from './services/weatherService.js';

export default function SearchBox({ updateInfo }) {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const speech = event.results[0][0].transcript;
      setCity(speech);
      handleVoiceSearch(speech);
    };

    recognition.onspeechend = () => stopListening();
    recognition.onerror = (event) => {
      console.error(event.error);
      stopListening();
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  const handleVoiceSearch = async (query) => {
    if (!query) return;
    setLoading(true);
    setError('');
    try {
      const result = await getWeatherByCity(query);
      updateInfo(result);
      setCity('');
    } catch (err) {
      setError(err.message || 'Error fetching weather');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (evt) => setCity(evt.target.value);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const query = city.trim();
    if (!query) {
      setError('Please enter a city name');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await getWeatherByCity(query);
      updateInfo(result);
      setCity('');
    } catch (err) {
      setError(err.message || 'Error fetching weather');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TextField
            id="city"
            label="City Name"
            variant="outlined"
            required
            value={city}
            onChange={handleChange}
            disabled={loading}
            sx={{
              width: 300,
              borderRadius: 12,
              input: { fontSize: 16, color: '#fff' },
              '& .MuiOutlinedInput-root': {
                borderRadius: 12,
                backgroundColor: 'rgba(0,0,0,0.25)',
                color: '#fff',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                '&:hover fieldset': { borderColor: '#fff' },
                '&.Mui-focused fieldset': { borderColor: '#fff' },
              },
              '& label': { color: 'rgba(255,255,255,0.8)' },
              '& label.Mui-focused': { color: '#fff' },
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            }}
          />
          <Button
            onClick={listening ? stopListening : startListening}
            sx={{
              minWidth: 48,
              minHeight: 48,
              borderRadius: '50%',
              backgroundColor: listening ? '#ff4d4d' : '#4facfe',
              color: '#fff',
              '&:hover': { backgroundColor: listening ? '#ff6666' : '#00f2fe', transform: 'scale(1.1)' },
              transition: 'all 0.3s',
            }}
          >
            {listening ? <StopIcon /> : <MicIcon />}
          </Button>
        </div>

        <Button
          variant="contained"
          type="submit"
          disabled={loading}
          sx={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: '#fff',
            fontWeight: 600,
            padding: '8px 24px',
            borderRadius: 12,
            '&:hover': { background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)', transform: 'scale(1.05)' },
            transition: 'all 0.3s',
          }}
        >
          {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Search'}
        </Button>
      </form>

      {error && (
        <Alert severity="error" sx={{ width: 300, mt: 1, zIndex: 1 }}>
          {error}
        </Alert>
      )}
    </div>
  );
}
