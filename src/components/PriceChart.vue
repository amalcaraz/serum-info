<template>
  <apexchart height="350" :options="options" :series="series"></apexchart>
</template>

<script>
import { defineComponent } from "vue";
import numeral from "numeral";
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
        onData: (step, candle) => [step.toMillis(), candle.close],
        onEmpty: (step, lastCandle) => [step.toMillis(), lastCandle.close],
      });

      return [
        {
          name: "price",
          data,
        },
      ];
    },
    options() {
      const common = commonChartOptions();
      const { symbol, decimals } = this.market.pc;
      const format = `0,0[.]00[${Array(decimals - 2)
        .fill(0)
        .join("")}]`;

      return {
        ...common,
        yaxis: {
          labels: {
            formatter(val) {
              return `${numeral(val).format(format)} ${symbol}`;
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