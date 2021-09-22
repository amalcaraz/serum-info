<template>
  <apexchart height="350" :options="options" :series="series"></apexchart>
</template>

<script>
import { defineComponent } from "vue";
import numeral from "numeral";
import { commonChartOptions, commonChartSeries } from "../services/charts";

export default defineComponent({
  name: "TvlChart",
  props: ["market", "tvl", "timeUnit", "timeSize", "numCandles"],
  computed: {
    series() {
      const data = commonChartSeries(this.tvl, {
        timeUnit: this.timeUnit,
        timeSize: this.timeSize,
        numCandles: this.numCandles,
        onData: (step, candle) => [step.toMillis(), candle.tvlCoin],
        onEmpty: (step, lastCandle) => [step.toMillis(), lastCandle.tvlCoin],
      });

      return [
        {
          name: "tvl",
          data,
        },
      ];
    },
    options() {
      const common = commonChartOptions();
      const { symbol, decimals } = this.market.coin;
      const hasUsd = this.market.pc.symbol.includes("USD");

      return {
        ...common,
        yaxis: {
          labels: {
            formatter(val) {
              return `${numeral(val / 10 ** decimals).format("0,0")} ${
                hasUsd ? "$" : symbol
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