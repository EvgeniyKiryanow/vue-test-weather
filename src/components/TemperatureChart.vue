<template>
    <div>
      <canvas ref="chartCanvas"></canvas>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, onBeforeUnmount, ref, watch, PropType } from 'vue';
  import Chart from 'chart.js/auto';
  
  interface HourlyData {
    time: string;
    temp: number;
  }
  
  export default defineComponent({

    props: {
      hourlyData: {
        type: Array as PropType<HourlyData[]>,
        required: true,
      },
      isLoading: {
        type: Boolean,
        false: true,
        default: true
      }
    },
    setup(props) {
      const chartCanvas = ref<HTMLCanvasElement | null>(null);
      let chartInstance: Chart | null = null;
  
      function createChart(data: HourlyData[]) {
        if (chartCanvas.value) {
          chartInstance = new Chart(chartCanvas.value, {
            type: 'line',
            data: {
              labels: data.map(d => d.time),
              datasets: [
                {
                  label: 'Temperature (°C)',
                  data: data.map(d => d.temp),
                  borderColor: 'rgba(75, 192, 192, 1)',
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                },
              ],
            },
            options: {
              responsive: true,
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Time',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Temperature (°C)',
                  },
                },
              },
            },
          });
        }
      }
  
      onMounted(() => {
        createChart(props.hourlyData);
      });
  
      watch(
        () => props.hourlyData,
        (newData) => {
          if (chartInstance) {
            chartInstance.data.labels = newData.map(d => d.time);
            chartInstance.data.datasets[0].data = newData.map(d => d.temp);
            chartInstance.update();
          } else {
            createChart(newData);
          }
        },
        { immediate: true }
      );
  
      onBeforeUnmount(() => {
        if (chartInstance) {
          chartInstance.destroy();
        }
      });
  
      return { chartCanvas };
    },
  });
  </script>
  
  <style scoped>
/* TemperatureChart.vue */
.chart-container {
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
}

canvas {
  width: 100%;
  height: 300px;
}

@media (max-width: 768px) {
  .chart-container {
    max-width: 100%;
    margin-top: 10px;
  }

  canvas {
    height: 250px;
  }
}

  </style>
  