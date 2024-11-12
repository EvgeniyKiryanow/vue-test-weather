// src/stores/index.ts
import { defineStore } from 'pinia';

interface City {
  id: number;
  name: string;
  main: { temp: number };
  weather: Array<{ description: string }>;
}

export const useWeatherStore = defineStore('weatherStore', {
  state: () => ({
    favorites: JSON.parse(localStorage.getItem('favorites') || '[]') as City[],
    cities: [] as City[],  // Stores all cities added on the home page
    hourlyWeather: {} as Record<string, { time: string; temp: number }[]>, // Store hourly data by city name
    dailyForecasts: {} as Record<string, { date: string; avgTemp: string }[]>, // Store 5-day forecast data
  }),
  actions: {
    toggleFavorite(city: City) {
      const index = this.favorites.findIndex(fav => fav.id === city.id);
      if (index === -1) {
        this.favorites.push(city);
      } else {
        this.favorites.splice(index, 1);
      }
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
    },

    addCity(city: City, hourlyData: { time: string; temp: number }[], dailyForecast: { date: string; avgTemp: string }[]) {
      // Add city to cities array if not already added
      if (!this.cities.some(existingCity => existingCity.id === city.id)) {
        this.cities.push(city);
        // Store hourly data for the city
        this.hourlyWeather[city.name] = hourlyData;
        this.dailyForecasts[city.name] = dailyForecast;
      }
    },

    removeCity(id: number) {
      this.cities = this.cities.filter(city => city.id !== id);
      // Also remove the hourly and daily data for the city
      const cityToRemove = this.cities.find(city => city.id === id);
      if (cityToRemove) {
        delete this.hourlyWeather[cityToRemove.name];
        delete this.dailyForecasts[cityToRemove.name];
      }
    },
  },
});
