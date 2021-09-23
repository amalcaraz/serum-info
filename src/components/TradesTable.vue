<template>
  <q-card class="bg-card">
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="white"
      indicator-color="white"
      narrow-indicator
      no-caps
      align="left"
      style="position: absolute; z-index: 10; padding: 7px 16px"
    >
      <q-tab name="all" label="Trades" />
      <!-- <q-tab name="swap" label="Swaps" />
      <q-tab name="deposit" label="Adds" />
      <q-tab name="withdraw" label="Removes" /> -->
    </q-tabs>
    <q-table
      :rows="filteredTrades"
      :columns="eventCols"
      flat
      card-class="bg-transparent"
      :pagination="{ rowsPerPage: 15 }"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td
            key="title"
            :props="props"
            class="text-white"
            style="min-width: 100px"
          >
            {{ props.row.market }}
          </q-td>
          <q-td key="account" :props="props">
            <a
              label="Trade initiator"
              :href="`https://explorer.solana.com/address/${props.row.account}`"
              target="_blank"
              rel="noopener"
            >
              {{ props.row.account }}
            </a>
          </q-td>
          <q-td
            key="side"
            :props="props"
            :class="{
              buy: props.row.side === 'buy',
              sell: props.row.side === 'sell',
            }"
          >
            {{ props.row.side === "buy" ? "Buy" : "Sell" }}
          </q-td>
          <q-td key="price" :props="props">
            {{ numeral(props.row.price).format(`0,0[.]00`) }}
            {{ props.row.quoteToken.symbol }}
          </q-td>
          <q-td key="amount" :props="props">
            <template v-if="props.row.baseToken">
              {{
                numeral(props.row.baseAmount)
                  .divide(10 ** props.row.baseToken.decimals)
                  .format(`0,0[.]00`)
              }}
              {{ props.row.baseToken.symbol }}
            </template>
          </q-td>
          <q-td key="cost" :props="props">
            <template v-if="props.row.quoteToken">
              {{
                numeral(props.row.quoteAmount)
                  .divide(10 ** props.row.quoteToken.decimals)
                  .format(`0,0[.]00`)
              }}
              {{ props.row.quoteToken.symbol }}
            </template>
          </q-td>
          <q-td key="fee" :props="props">
            <template v-if="props.row.quoteToken">
              {{
                numeral(props.row.feeAmount)
                  .divide(10 ** props.row.quoteToken.decimals)
                  .format(`0,0[.]00`)
              }}
              {{ props.row.quoteToken.symbol }}
              <template v-if="props.row.quoteToken < 0"> (Rebate)</template>
            </template>
          </q-td>
          <q-td key="time" :props="props">
            {{ DateTime.fromMillis(props.row.timestamp).toRelative() }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-card>
</template>


<script>
import { defineComponent } from "vue";
import numeral from "numeral";
import { DateTime } from "luxon";

export default defineComponent({
  name: "TradesTable",
  props: ["trades"],
  computed: {
    filteredTrades() {
      let trades = this.trades.filter(
        (trade) => !trade.usdValue || trade.usdValue > 10
      );
      if (this.tab === "all") return trades;
      else {
        return trades.filter((ev) => ev.type === this.tab);
      }
    },
  },
  data() {
    return {
      tab: "all",
      DateTime,
      numeral: numeral,
      eventCols: [
        {
          name: "title",
          field: "title",
          align: "left",
        },
        {
          name: "account",
          field: "account",
          label: "Initiator",
          align: "left",
        },
        {
          name: "side",
          field: "side",
          align: "right",
          label: "Side",
          sortable: true,
        },
        {
          name: "price",
          field: "price",
          align: "right",
          label: "Price",
          sortable: true,
        },
        {
          name: "amount",
          field: "amount",
          align: "right",
          label: "Amount",
          sortable: true,
        },
        {
          name: "cost",
          field: "cost",
          align: "right",
          label: "Cost",
          sortable: true,
        },
        {
          name: "fee",
          field: "fee",
          align: "right",
          label: "Fee",
          sortable: true,
        },
        {
          name: "time",
          field: "time",
          align: "right",
          label: "Time",
          sortable: true,
        },
      ],
    };
  },
});
</script>


<style lang="css">
.buy {
  /* color: #55dd55; */
  /* color: #00b746; */
  color: #00b3c8;
}
.sell {
  /* color: #dd5555; */
  /* color: #ef403c; */
  color: #df7d46;
}
</style>