<template>
    <div>
      <h2>Your Favorites</h2>
      <div v-if="loading"><PreloaderUi :isLoading="loading" /></div>
      <div v-else v-for="city in favorites" :key="city.id">
        <WeatherCard :weather="city" />
        <TemperatureChart v-if="hourlyWeather[city.name]" :hourlyData="hourlyWeather[city.name]" />
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { useWeatherStore } from '../stores/index';
  import WeatherCard from '../components/WeatherCard.vue';
  import TemperatureChart from '../components/TemperatureChart.vue';
  import weatherService from '../services/weatherService';
  import PreloaderUi from "../components/Preloader.vue";
  
  export default defineComponent({
    components: { WeatherCard, TemperatureChart, PreloaderUi },
    setup() {
      const store = useWeatherStore();
      const favorites = store.favorites;
      const hourlyWeather = ref<{ [key: string]: Array<{ time: string; temp: number }> }>({});
      const loading = ref(false); // Loading state for preloader
  
      async function fetchHourlyWeather() {
        loading.value = true; // Show preloader
        for (const city of favorites) {
          try {
            const forecast = await weatherService.getWeatherForecast(city.name);
            hourlyWeather.value[city.name] = formatHourlyData(forecast);
          } catch (error) {
            console.error(`Error fetching forecast for ${city.name}:`, error);
          }
        }
        loading.value = false; // Hide preloader after all data is fetched
      }
  
      function formatHourlyData(forecast: { list: Array<{ dt: number; main: { temp: number } }> }) {
        const currentDate = new Date().getDate();
        return forecast.list
          .filter(item => new Date(item.dt * 1000).getDate() === currentDate)
          .map(item => ({
            time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            temp: item.main.temp,
          }));
      }
  
      onMounted(fetchHourlyWeather);
  
      return {
        favorites,
        hourlyWeather,
        loading, // Include loading state
      };
    },
  });
  </script>