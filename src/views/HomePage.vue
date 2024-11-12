<template>
  <div>
    <CityAutocomplete :citiesCount="store.cities.length" @selectCity="fetchCityWeather" />
    <button v-if="store.cities.length < 5" @click="addWeatherCard">Add City</button>

    <div v-if="loading"><PreloaderUi :isLoading="loading" /></div>
    <div v-for="city in store.cities" :key="city.id">
        <WeatherCard :weather="city" @deleteWeather="deleteWeather" />
        <TemperatureChart v-if="store.hourlyWeather[city.name]" :hourlyData="store.hourlyWeather[city.name]" />
    </div>

    <div v-if="isModalVisible" class="modal-overlay">
      <div class="modal">
        <p>Do you want to delete this block?</p>
        <div class="modal-buttons">
          <button @click="confirmDelete">Yes</button>
          <button @click="cancelDelete">No</button>
        </div>
      </div>
    </div>

    <div v-if="isLimitModalVisible" class="modal-overlay">
      <div class="modal">
        <p>Maximum of 5 favorites allowed. Remove a city to add a new one.</p>
        <button @click="closeLimitModal">Okay</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { defineComponent } from 'vue';
import { useWeatherStore } from '../stores/index';
import CityAutocomplete from '../components/CityAutocomplete.vue';
import WeatherCard from '../components/WeatherCard.vue';
import TemperatureChart from '../components/TemperatureChart.vue';
import weatherService from '../services/weatherService';
import PreloaderUi from "../components/Preloader.vue";

export default defineComponent({
  components: { CityAutocomplete, WeatherCard, TemperatureChart, PreloaderUi },
  setup() {
    const store = useWeatherStore();
    const isModalVisible = ref(false);
    const isLimitModalVisible = ref(false);
    const weatherToDelete = ref<number | null>(null);
    const loading = ref(false);

    onMounted(async () => {
      const userCity = await weatherService.getUserCity();
      if (userCity) {
        await fetchCityWeather(userCity);
      }
    });

    async function fetchCityWeather(cityName: string) {
      loading.value = true; 
      try {
        const weather = await weatherService.getCurrentWeather(cityName);
        const forecast = await weatherService.getWeatherForecast(cityName);
        const fiveDayForecast = await weatherService.getFiveDayForecast(cityName);
        const formattedHourlyData = formatHourlyData(forecast);
        const formattedDailyData = formatDailyData(fiveDayForecast);
        store.addCity(weather, formattedHourlyData, formattedDailyData); 
      } catch (error) {
        console.error('Error fetching city weather:', error);
      } finally {
        loading.value = false; 
      }
    }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    function formatDailyData(forecast: any) {
      const groupedByDay: { [key: string]: number[] } = {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      forecast.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!groupedByDay[date]) {
          groupedByDay[date] = [];
        }
        groupedByDay[date].push(item.main.temp);
      });

      return Object.entries(groupedByDay).map(([date, temps]) => {
        const avgTemp = temps.reduce((sum, temp) => sum + temp, 0) / temps.length;
        return { date, avgTemp: avgTemp.toFixed(1) };
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function formatHourlyData(forecast: any) {
      const currentDate = new Date().getDate();
      return forecast.list
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((item: any) => new Date(item.dt * 1000).getDate() === currentDate)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((item: any) => ({
          time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          temp: item.main.temp,
        }));
    }

    function addWeatherCard() {
      const cityName = 'New York';  // TODO update
      fetchCityWeather(cityName);
    }

    function deleteWeather(id: number) {
      weatherToDelete.value = id;
      isModalVisible.value = true;
    }

    function confirmDelete() {
      if (weatherToDelete.value !== null) {
        store.removeCity(weatherToDelete.value);
      }
      isModalVisible.value = false;
    }

    function cancelDelete() {
      isModalVisible.value = false;
    }

    function closeLimitModal() {
      isLimitModalVisible.value = false;
    }

    return {
      store,
      fetchCityWeather,
      deleteWeather,
      confirmDelete,
      cancelDelete,
      isModalVisible,
      isLimitModalVisible,
      closeLimitModal,
      addWeatherCard,
      loading,
    };
  },
});
</script>
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  transition: opacity 0.3s ease;
}

.modal {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  width: 300px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-buttons {
  display: flex;
  justify-content: space-around;
}

.modal-buttons button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.modal-buttons button:hover {
  background-color: #0056b3;
}

.modal-buttons button:nth-child(2) {
  background-color: #dc3545;
}

.modal-buttons button:nth-child(2):hover {
  background-color: #c82333;
}
</style>
