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
    <p v-if="isLimitReached" style="color: red;">{{ $t('common.cityLimitReached') }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';

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
    const { t, locale } = useI18n();
    const query = ref('');
    const suggestions = ref<Suggestion[]>([]);
    const isLimitReached = computed(() => _.citiesCount >= 5);

    const fetchSuggestions = async () => {
      if (query.value.length > 2 && !isLimitReached.value) {
        const lang = locale.value; 
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${query.value}&limit=5&appid=75954bfa960f3845eb0a2b27a42f67ab&lang=${lang}`);
        const data = await response.json();
        suggestions.value = data;
      }
    };

    watch(locale, () => {
      fetchSuggestions(); 
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
/* TODO: update style */
</style>
