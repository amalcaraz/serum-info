<template>
  <apexchart height="350" :options="options" :series="series"></apexchart>
</template>

<script>
import { defineComponent } from "vue";
import numeral from "numeral";
import { commonChartOptions, commonChartSeries } from "../services/charts";

export default defineComponent({
  name: "VolumeChart",
  props: ["market", "ohlcv", "timeUnit", "timeSize", "numCandles"],
  computed: {
    series() {
      const data = commonChartSeries(this.ohlcv, {
        timeUnit: this.timeUnit,
        timeSize: this.timeSize,
        numCandles: this.numCandles,
        onData: (step, candle) => [step.toMillis(), candle.volume],
        onEmpty: (step, lastCandle) => [step.toMillis(), lastCandle.volume],
      });

      return [
        {
          name: "volume",
          data,
        },
      ];
    },
    options() {
      const common = commonChartOptions();

      return {
        ...common,
        yaxis: {
          labels: {
            formatter(val) {
              return `${numeral(val / 10 ** 6).format("0,0 $")}`;
            },
          },
        },
      };
    },
  },
});
</script>

<style lang="css">
.apexcharts-text {
  fill: #fff;
}
.apexcharts-tooltip,
.apexcharts-tooltip-title,
.apexcharts-menu {
  color: #000 !important;
}
</style>