// src/i18n.ts
import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    weather: {
      temperature: 'Temperature',
      condition: 'Condition',
      noData: 'No weather data available',
    },
    common: {
      loading: 'Loading...',
    }
  },
  uk: {
    weather: {
      temperature: 'Температура',
      condition: 'Стан',
      noData: 'Дані про погоду недоступні',
    },
    common: {
      loading: 'Завантаження...',
    }
  }
};

const i18n = createI18n({
  locale: 'en', // default language
  messages
});

export default i18n;
