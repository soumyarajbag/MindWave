import { WeatherCondition } from '@/types';

export interface WeatherData {
  condition: WeatherCondition;
  temperature: number;
  description: string;
  location: string;
}

export const getWeatherData = async (lat?: number, lon?: number): Promise<WeatherData> => {
  try {
    // Try to get user's location if not provided
    if (!lat || !lon) {
      const position = await getCurrentPosition();
      lat = position.lat;
      lon = position.lon;
    }

    const apiKey = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY : undefined;
    if (!apiKey) {
      // Return default weather if API key not configured
      return getDefaultWeather();
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      return getDefaultWeather();
    }

    const data = await response.json();
    
    // Map weather condition to our WeatherCondition type
    const condition = mapWeatherCondition(data.weather[0].main, data.weather[0].id);
    
    return {
      condition,
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      location: data.name,
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    return getDefaultWeather();
  }
};

const getCurrentPosition = (): Promise<{ lat: number; lon: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
};

const mapWeatherCondition = (main: string, id: number): WeatherCondition => {
  // Check for night time (rough estimate)
  const hour = new Date().getHours();
  const isNight = hour >= 20 || hour < 6;

  if (isNight) {
    return 'night';
  }

  // Map OpenWeather conditions
  switch (main.toLowerCase()) {
    case 'rain':
    case 'drizzle':
      return 'rain';
    case 'clear':
      return 'sunny';
    case 'clouds':
      return 'cloudy';
    case 'snow':
      return 'snow';
    case 'mist':
    case 'fog':
    case 'haze':
      return 'fog';
    default:
      return 'cloudy';
  }
};

const getDefaultWeather = (): WeatherData => {
  const hour = new Date().getHours();
  const isNight = hour >= 20 || hour < 6;
  
  return {
    condition: isNight ? 'night' : 'sunny',
    temperature: 22,
    description: isNight ? 'Clear night' : 'Clear sky',
    location: 'Unknown',
  };
};

