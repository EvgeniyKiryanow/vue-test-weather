<!-- src/components/WeatherChart.vue -->
<template>
    <div>
      <canvas ref="chart"></canvas>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, PropType, ref } from 'vue';
  import Chart from 'chart.js/auto';
  
  export default defineComponent({
    props: {
      temperatures: {
        type: Array as PropType<number[]>,
        required: true,
      },
    },
    setup(props) {
      const chart = ref<HTMLCanvasElement | null>(null);
  
      onMounted(() => {
        if (chart.value) {
          new Chart(chart.value, {
            type: 'line',
            data: {
              labels: props.temperatures.map((_: unknown, index: unknown) => `${index} ч`),
              datasets: [
                {
                  label: 'Температура (°C)',
                  data: props.temperatures,
                  borderColor: 'blue',
                  fill: false,
                },
              ],
            },
          });
        }
      });
  
      return { chart };
    },
  });
  </script>
  