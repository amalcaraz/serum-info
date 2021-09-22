
<template>
  <q-page class="q-pa-xl">
    <div class="bg-raydium-gradient rounded-borders q-pa-one">
      <q-table
        title="Markets"
        :rows="displayedMarkets"
        :columns="marketcols"
        :sort-method="customSort"
        row-key="name"
        :pagination="{
          rowsPerPage: 25,
          sortBy: 'tvl',
          descending: true,
        }"
        class="bg-dark-opacity"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props" class="text-white">
              <router-link
                :to="{ name: 'market', params: { address: props.row.address } }"
                class="text-white text-bold"
              >
                <q-avatar size="xs">
                  <img :src="props.row.coin.logoURI" />
                </q-avatar>
                <q-avatar size="xs">
                  <img :src="props.row.pc.logoURI" />
                </q-avatar>
                {{ props.row.name }}
              </router-link>
            </q-td>
            <q-td key="tvl" :props="props">
              {{ numeral(props.row.stats.tvlUsd / 10 ** 6).format("0,0 $") }}
            </q-td>
            <q-td key="vol24h" :props="props">
              {{ numeral(props.row.stats.vol24hUsd / 10 ** 6).format("0,0 $") }}
            </q-td>
            <q-td key="price" :props="props">
              {{ numeral(props.row.stats.priceUsd).format("0,0 $") }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

import marketsQuery from "../queries/markets.gql";
import { client } from "../services/graphql";
import { get_token } from "../services/tokens";
import numeral from "numeral";

export default defineComponent({
  name: "IndexPage",
  computed: {
    displayedMarkets() {
      return this.markets
        .filter((market) => market.version > 2)
        .map((market) => ({
          ...market,
          coin: get_token(market.coin.address, market.coin),
          pc: get_token(market.pc.address, market.pc),
        }));
    },
  },
  methods: {
    customSort(rows, sortBy, descending) {
      const data = [...rows];

      if (sortBy) {
        data.sort((a, b) => {
          const x = descending ? b : a;
          const y = descending ? a : b;
          let xVal, yVal;

          switch (sortBy) {
            case "name": {
              xVal = x.name;
              yVal = y.name;
              break;
            }
            case "tvl": {
              xVal = x.stats.tvlUsd;
              yVal = y.stats.tvlUsd;
              break;
            }
            case "price": {
              xVal = x.stats.priceUsd;
              yVal = y.stats.priceUsd;
              break;
            }
            case "vol24h": {
              xVal = x.stats.vol24hUsd;
              yVal = y.stats.vol24hUsd;
              break;
            }
          }

          return typeof xVal === "string"
            ? xVal.localeCompare(yVal)
            : xVal - yVal;
        });
      }

      return data;
    },
  },
  async setup() {
    let result = await client.request(marketsQuery);

    return {
      markets: result.markets,
      marketcols: [
        {
          name: "name",
          label: "Market name",
          field: "name",
          align: "left",
          sortable: true,
        },
        {
          name: "tvl",
          label: "TVL",
          field: "tvl",
          sortable: true,
        },
        {
          name: "vol24h",
          label: "Volume (24h)",
          field: "vol24h",
          sortable: true,
        },
        {
          name: "price",
          label: "Last Price",
          field: "price",
          sortable: true,
        },
      ],
      numeral,
    };
  },
});
</script>
