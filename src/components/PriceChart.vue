<template>
  <apexchart height="350" :options="options" :series="series"></apexchart>
</template>

<script>
import { defineComponent } from "vue";
import { DateTime } from "luxon";
import { commonChartOptions, commonChartSeries } from "../services/charts";

export default defineComponent({
  name: "PriceChart",
  props: ["market", "ohlcv", "timeUnit", "timeSize", "numCandles"],
  computed: {
    series() {
      const data = commonChartSeries(this.ohlcv, {
        timeUnit: this.timeUnit,
        timeSize: this.timeSize,
        numCandles: this.numCandles,
        onData: (step, candle) => [
          step.toMillis(),
          candle.open,
          candle.high,
          candle.low,
          candle.close,
        ],
        onEmpty: (step, lastCandle) => [
          step.toMillis(),
          lastCandle.close,
          lastCandle.close,
          lastCandle.close,
          lastCandle.close,
        ],
      });

      return [
        {
          name: "price",
          data,
        },
      ];
    },
    options() {
      const common = commonChartOptions(this.ohlcv);

      return {
        ...common,
        chart: {
          ...common.chart,
          type: "candlestick",
          stacked: false,
          height: 350,
        },
        dataLabels: {
          enabled: false,
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