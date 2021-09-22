<template>
  <q-page>
    <h4>
      <q-avatar>
        <img :src="market.coin.logoURI" />
      </q-avatar>
      <q-avatar style="margin-left: -12px">
        <img :src="market.pc.logoURI" />
      </q-avatar>
      {{ market.coin.symbol }}-{{ market.pc.symbol }} Market
    </h4>
    <div class="flex q-mb-md justify-between">
      <div class="row q-gutter-sm" v-if="market.stats.price !== null">
        <q-card class="q-pa-sm bg-dark-60">
          <q-avatar size="sm">
            <img :src="market.pc.logoURI" />
          </q-avatar>
          1 {{ market.pc.symbol }} = {{ (1 / market.stats.price).toFixed(4) }}
          {{ market.coin.symbol }}
        </q-card>
        <q-card class="q-pa-sm bg-dark-60">
          <q-avatar size="sm">
            <img :src="market.coin.logoURI" />
          </q-avatar>
          1 {{ market.coin.symbol }} = {{ market.stats.price.toFixed(4) }}
          {{ market.pc.symbol }}
        </q-card>
      </div>
      <div class="q-gutter-md">
        <q-btn
          color="primary"
          label="Trade"
          type="a"
          :href="`https://dex.projectserum.com/#/market/${market.address}`"
          target="_blank"
          rel="noopener"
        />
      </div>
    </div>
    <div class="flex q-gutter-md q-mb-md items-stretch">
      <q-card class="bg-card col-auto" style="min-width: 300px">
        <q-card-section>
          <div class="q-pa-one">
            <q-card class="shadow-0 bg-dark-opacity">
              <q-card-section>
                <h6 class="q-ma-none q-pb-sm">Total tokens locked</h6>
                <div
                  class="row justify-between items-center q-mb-sm q-gutter-md"
                >
                  <span>
                    <q-avatar size="sm">
                      <img :src="market.coin.logoURI" />
                    </q-avatar>
                    {{ market.coin.symbol }}
                  </span>
                  <span>
                    {{ numeral(market.stats.tvl_coin).format("0,0.00") }}
                  </span>
                </div>
                <div
                  class="row justify-between items-center q-mb-sm q-gutter-md"
                >
                  <span>
                    <q-avatar size="sm">
                      <img :src="market.pc.logoURI" />
                    </q-avatar>
                    {{ market.pc.symbol }}
                  </span>
                  <span>
                    {{ numeral(market.stats.tvl_pc).format("0,0.00") }}
                  </span>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <p class="q-pt-md text-bold q-mb-none">TVL</p>
          <p class="text-h5">
            {{ numeral(market.stats.tvl_usd).format("0,0 $") }}
          </p>
          <p class="q-pt-md text-bold q-mb-none">Volume (24h)</p>
          <p class="text-h5">
            {{ numeral(market.stats.vol24h_usd).format("0,0 $") }}
          </p>
        </q-card-section>
      </q-card>
      <div class="col-grow" v-if="ohlcv">
        <q-card class="bg-card">
          <q-tabs
            v-model="chartTab"
            dense
            class="text-grey"
            active-color="white"
            align="right"
            narrow-indicator
            indicator-color="serum-purple"
          >
            <q-tab name="price" label="Price" />
            <!-- <q-tab name="tvl" label="TVL" /> -->
            <q-tab name="volume" label="Volume" />
          </q-tabs>
          <q-separator />
          <q-tab-panels v-model="chartTab" animated>
            <q-tab-panel name="price" class="bg-dark-60">
              <price-chart
                :market="market"
                :ohlcv="ohlcv"
                :intervalUnit="intervalUnit"
                :numCandles="numCandles"
              />
            </q-tab-panel>
            <!-- <q-tab-panel name="tvl" class="bg-dark-60">
              <apexchart
                type="area"
                height="350"
                :options="tvlChartOptions"
                :series="tvlSeries"
              ></apexchart>
            </q-tab-panel> -->
            <q-tab-panel name="volume" class="bg-dark-60">
              <volume-chart
                :market="market"
                :ohlcv="ohlcv"
                :intervalUnit="intervalUnit"
                :numCandles="numCandles"
              />
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>
    <suspense>
      <template #default>
        <trades-history :address="address" />
      </template>
      <template #fallback>
        <div class="flex flex-center">
          <q-spinner-pie color="white" size="4em" />
        </div>
      </template>
    </suspense>
  </q-page>
</template>


<script>
import { defineComponent } from "vue";
import numeral from "numeral";
import marketDetailsQuery from "../queries/marketDetails.gql";
import { client } from "../services/graphql";
import { get_token } from "../services/tokens";
import TradesHistory from "src/components/TradesHistory.vue";
import PriceChart from "src/components/PriceChart.vue";
import VolumeChart from "src/components/VolumeChart.vue";
import { DateTime } from "luxon";

export default defineComponent({
  components: { TradesHistory, PriceChart, VolumeChart },
  name: "MarketPage",
  props: {
    address: String,
  },
  data() {
    return {
      chartTab: "price",
    };
  },
  computed: {
    tvlSeries() {
      let values = [];
      let last_value = null;
      let has_usd = this.market.pc.symbol.includes("USD");
      let tvl_key = "tvl_usd";
      if (!has_usd) tvl_key = "tvl_coin";
      for (let point of this.ohlcv) {
        if (point[tvl_key] !== null) {
          last_value = point[tvl_key];
        }
        values.push(last_value);
      }
      return [
        {
          name: "tvl",
          data: values,
        },
      ];
    },
    tvlChartOptions() {
      let has_usd = this.market.pc.symbol.includes("USD");
      let tvl_format = "0,0 $";
      if (!has_usd) {
        tvl_format = `0,0 ${this.market.coin.symbol}`;
      }
      return {
        yaxis: {
          labels: {
            formatter: function (val) {
              return numeral(val).format(tvl_format);
            },
          },
        },
      };
    },
  },
  async setup(props) {
    const now = DateTime.now();

    const intervalUnit = "hour";
    const numCandles = 24;

    let result = await client.request(marketDetailsQuery, {
      address: props.address,
      intervalUnit,
      startDate: now.minus({ [intervalUnit]: numCandles }).valueOf(),
      endDate: now.valueOf(),
    });

    result.market.coin = get_token(
      result.market.coin.address,
      result.market.coin
    );
    result.market.pc = get_token(result.market.pc.address, result.market.pc);

    return {
      numeral,
      intervalUnit,
      numCandles,
      ...result,
    };
  },
});
</script>
