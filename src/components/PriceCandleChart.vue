<template>
  <apexchart height="350" :options="options" :series="series"></apexchart>
</template>

<script>
import { defineComponent } from "vue";
import numeral from "numeral";
import { commonChartOptions, commonChartSeries } from "../services/charts";

export default defineComponent({
  name: "PriceCandleChart",
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
      const { yaxis, ...common } = commonChartOptions();
      const { symbol, decimals } = this.market.pc;
      const format = `0,0[.]00[${Array(decimals - 2)
        .fill(0)
        .join("")}]`;

      return {
        ...common,
        chart: {
          ...common.chart,
          type: "candlestick",
          stacked: false,
          height: 350,
        },
        yaxis: {
          labels: {
            formatter(val) {
              return `${numeral(val).format(format)} ${symbol}`;
            },
          },
        },
        plotOptions: {
          candlestick: {
            colors: {
              upward: "#00b3c8",
              downward: "#DF7D46",
            },
            wick: { useFillColor: true },
          },
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