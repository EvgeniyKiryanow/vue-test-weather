<template>
    <div>
      <!-- TODO update logic -->
      <button @click="switchLanguage('en')">English</button>
      <button @click="switchLanguage('uk')">Українська</button>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { useI18n } from 'vue-i18n';
  
  export default defineComponent({
    setup() {
      const { locale } = useI18n();
      
      const switchLanguage = (lang: string) => {
        locale.value = lang;
      };
  
      return {
        switchLanguage
      };
    }
  });
  </script>
  