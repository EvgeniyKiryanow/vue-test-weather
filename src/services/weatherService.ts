import axios from 'axios';

const API_KEY = '75954bfa960f3845eb0a2b27a42f67ab';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';

interface WeatherData {
  id: number;
  name: string;
  main: { temp: number };
  weather: Array<{ description: string }>;
}

interface ForecastData {
  list: Array<{ dt: number; main: { temp: number } }>;
}

export default {
  async getCurrentWeather(city: string): Promise<WeatherData> {
    const response = await axios.get<WeatherData>(`${BASE_URL}weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
        lang: 'en',
      },
    });
    return response.data;
  },

  async getWeatherForecast(city: string): Promise<ForecastData> {
    const response = await axios.get<ForecastData>(`${BASE_URL}forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
        lang: 'en',
      },
    });
    return response.data;
  },

  async getFiveDayForecast(city: string): Promise<ForecastData> {
    const response = await axios.get<ForecastData>(`${BASE_URL}forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
        lang: 'en',
      },
    });
    return response.data;
  },

  // New method to fetch the user's city based on their IP
  async getUserCity(): Promise<string | null> {
    try {
      const response = await axios.get('https://ipinfo.io/json');
      const city = response.data.city;
      return city;
    } catch (error) {
      console.error('Error fetching user location:', error);
      return null;
    }
  },
};
