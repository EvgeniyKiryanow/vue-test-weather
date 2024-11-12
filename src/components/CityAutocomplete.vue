<!-- src/components/CityAutocomplete.vue -->
<template>
  <div>
    <input
      v-model="query"
      @input="onInput"
      :placeholder="$t('common.enterCity')"
    />
    <ul v-if="suggestions.length && query.length > 2 && !isLimitReached">
      <li v-for="suggestion in suggestions" :key="suggestion.id" @click="selectCity(suggestion.name)">
        {{ suggestion.name }}
      </li>
    </ul>
    <!-- Show message if the limit is reached -->
    <p v-if="isLimitReached" style="color: red;">{{ $t('common.cityLimitReached') }}</p> <!-- Dynamically translate the message -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n'; // Import i18n to access the selected language

interface Suggestion {
  id: number;
  name: string;
}

export default defineComponent({
  emits: ['selectCity'],
  props: {
    citiesCount: {
      type: Number,
      required: true,
    },
  },
  setup(_, { emit }) {
    const { t, locale } = useI18n(); // Access i18n methods
    const query = ref('');
    const suggestions = ref<Suggestion[]>([]);
    const isLimitReached = computed(() => _.citiesCount >= 5); // Check if the city limit is reached

    const fetchSuggestions = async () => {
      if (query.value.length > 2 && !isLimitReached.value) {
        // Fetch suggestions with the selected language
        const lang = locale.value; // Get the current language
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${query.value}&limit=5&appid=75954bfa960f3845eb0a2b27a42f67ab&lang=${lang}`);
        const data = await response.json();
        suggestions.value = data;
      }
    };

    // Watch for language changes
    watch(locale, () => {
      fetchSuggestions(); // Fetch suggestions when the language changes
    });

    async function onInput() {
      await fetchSuggestions();
    }

    function selectCity(cityName: string) {
      emit('selectCity', cityName);
      suggestions.value = [];
      query.value = '';
    }

    return { query, suggestions, onInput, selectCity, isLimitReached, t };
  },
});
</script>

<style scoped>
/* Add custom styles if needed */
</style>
