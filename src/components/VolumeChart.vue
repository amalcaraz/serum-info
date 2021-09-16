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
      const common = commonChartOptions(this.ohlcv);
      const pc = this.market.pc;

      return {
        ...common,
        yaxis: {
          labels: {
            formatter: function (val) {
              return `${numeral(val / 10 ** pc.decimals).format("0,0")} ${
                pc.symbol
              }`;
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