<template v-if="isLoading">
  <div class="preloader-overlay">
    <div class="preloader"></div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'PreloaderUi',
  props: {
    isLoading: {
      type: Boolean,
      required: true,
      default: true
    }
  }
};
</script>

<style scoped>
.preloader-overlay {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.preloader {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #3498db;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
