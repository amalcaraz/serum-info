
<template>
  <q-page class="q-pa-xl">
    <div class="bg-raydium-gradient rounded-borders q-pa-one">
      <q-table
        title="Markets"
        :rows="displayedMarkets"
        :columns="marketcols"
        row-key="name"
        :pagination="{
          rowsPerPage: 25,
          sortBy: 'vol24h',
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
            <!-- <q-td key="tvl" :props="props">
              {{ numeral(props.row.tvl).format("0,0 $") }}
            </q-td> -->
            <q-td key="price" :props="props">
              <!-- {{ numeral(props.row.stats.price).format("0,0 $") }} -->
              {{ numeral(props.row.stats.price).format("0,0") }}
            </q-td>
            <q-td key="vol24h" :props="props">
              <!-- {{ numeral(props.row.stats.vol24h).format("0,0 $") }} -->
              {{ numeral(props.row.stats.vol24h).format("0,0") }}
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
        }))
        .sort((a, b) => a.tvl < b.tvl);
    },
  },
  async setup() {
    let result = await client.request(marketsQuery);
    console.log(result);

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
        // {
        //   name: "tvl",
        //   label: "TVL",
        //   field: "tvl",
        //   sortable: true,
        // },
        {
          name: "price",
          label: "Last Price",
          field: "price",
          sortable: true,
        },
        {
          name: "vol24h",
          label: "Volume (24h)",
          field: "vol24h",
          sortable: true,
        },
      ],
      numeral,
    };
  },
});
</script>
