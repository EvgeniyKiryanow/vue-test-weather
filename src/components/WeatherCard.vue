<template>
    <div class="weather-card" :class="{ favorite: isFavorite }">
    <h3>{{ weather.name }}</h3>
    <div v-if="isDayView">
      <p>{{ weather.main.temp }}°C, {{ weather.weather[0].description }}</p>
    </div>
    <div v-else>
      <div v-for="(forecast, index) in dailyForecasts" :key="index">
        <p>{{ forecast.date }} - Avg Temp: {{ forecast.avgTemp }}°C</p>
      </div>
    </div>
    <button @click="toggleView">
      {{ isDayView ? 'View 5-Day Forecast' : 'View Today\'s Weather' }}
    </button>

    <button @click="handleFavoriteToggle">
      {{ isFavorite ? 'Delete from favourites' : 'Add to favourites' }}
    </button>
    <button v-if="!isDeleting && !isFavorite" @click="confirmDelete">Delete this info block</button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue';
import { useWeatherStore } from '../stores/index';

interface Weather {
  id: number;
  name: string;
  main: { temp: number };
  weather: Array<{ description: string }>;
}

export default defineComponent({
  props: {
    weather: {
      type: Object as PropType<Weather>,
      required: true,
    },
    isLoading: {
      type: Boolean,
      false: true,
      default: true
    }
  },
  emits: ['deleteWeather', 'limitExceeded'],
  setup(props, { emit }) {
    const store = useWeatherStore();
    const isDeleting = ref(false);
    const isDayView = ref(true); 

    const isFavorite = computed(() => store.favorites.some(fav => fav.id === props.weather.id));

    function handleFavoriteToggle() {
      if (!isFavorite.value && store.favorites.length >= 5) {
        emit('limitExceeded');
        return;
      }
      store.toggleFavorite(props.weather);
    }

    function confirmDelete() {
      isDeleting.value = true;
      emit('deleteWeather', props.weather.id);
    }

    function toggleView() {
      isDayView.value = !isDayView.value;
    }

    const dailyForecasts = computed(() => {
      const hourlyData = store.hourlyWeather[props.weather.name];
      if (!hourlyData) return [];

      const groupedByDay: { [key: string]: number[] } = {};
      hourlyData.forEach(item => {
        const day = item.time.split(' ')[0];
        if (!groupedByDay[day]) {
          groupedByDay[day] = [];
        }
        groupedByDay[day].push(item.temp);
      });

      return Object.entries(groupedByDay).map(([date, temps]) => {
        const avgTemp = temps.reduce((sum, temp) => sum + temp, 0) / temps.length;
        return { date, avgTemp: avgTemp.toFixed(1) };
      });
    });

    return {
      isFavorite,
      handleFavoriteToggle,
      confirmDelete,
      toggleView,
      isDeleting,
      isDayView,
      dailyForecasts,
    };
  },
});
</script>
<style scoped>
.weather-card {
  border: 1px solid white;
}

.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 300px;
  margin-bottom: 20px;
}

.card h3 {
  font-size: 1.25rem;
  margin-bottom: 10px;
}

.card p {
  font-size: 1rem;
  text-align: center;
  margin-bottom: 10px;
}

.card button {
  padding: 8px 15px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.card button:hover {
  background-color: #218838;
}
</style>
