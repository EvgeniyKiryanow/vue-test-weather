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
    cities: [] as City[],  
    hourlyWeather: {} as Record<string, { time: string; temp: number }[]>, 
    dailyForecasts: {} as Record<string, { date: string; avgTemp: string }[]>, 
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
      if (!this.cities.some(existingCity => existingCity.id === city.id)) {
        // TODO use unshift
        this.cities.unshift(city);
        this.hourlyWeather[city.name] = hourlyData;
        this.dailyForecasts[city.name] = dailyForecast;
      }
    },

    removeCity(id: number) {
      this.cities = this.cities.filter(city => city.id !== id);
      const cityToRemove = this.cities.find(city => city.id === id);
      if (cityToRemove) {
        delete this.hourlyWeather[cityToRemove.name];
        delete this.dailyForecasts[cityToRemove.name];
      }
    },
  },
});
