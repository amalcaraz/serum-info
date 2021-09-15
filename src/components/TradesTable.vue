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
      :rows="formattedTrades"
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
            style="min-width: 350px"
          >
            <a
              v-if="props.row.side === 'buy'"
              class="buy"
              :href="`https://solscan.io/tx/${props.row.signature}`"
              target="_blank"
              rel="noopener"
            >
              Buy
              {{ props.row.sourceToken ? props.row.sourceToken.symbol : "???" }}
              with
              {{ props.row.targetToken ? props.row.targetToken.symbol : "???" }}
            </a>
            <a
              v-else
              class="sell"
              :href="`https://solscan.io/tx/${props.row.signature}`"
              target="_blank"
              rel="noopener"
            >
              Sell
              {{ props.row.sourceToken ? props.row.sourceToken.symbol : "???" }}
              for
              {{ props.row.targetToken ? props.row.targetToken.symbol : "???" }}
            </a>
          </q-td>
          <!-- <q-td key="usd_value" :props="props">
            {{ numeral(props.row.usd_value).format("0,0[.]00 $") }}
          </q-td> -->
          <q-td key="price" :props="props">
            {{ numeral(props.row.price).format(`0,0[.]00`) }}
            {{ props.row.targetToken.symbol }}
          </q-td>
          <q-td key="sourceAmount" :props="props">
            <template v-if="props.row.sourceToken">
              {{
                numeral(props.row.sourceAmount)
                  // .divide(10 ** props.row.sourceToken.decimals)
                  .format(`0,0[.]00`)
              }}
              {{ props.row.sourceToken.symbol }}
            </template>
          </q-td>
          <q-td key="targetAmount" :props="props">
            <template v-if="props.row.targetToken">
              {{
                numeral(props.row.targetAmount)
                  // .divide(10 ** props.row.targetToken.decimals)
                  .format(`0,0[.]00`)
              }}
              {{ props.row.targetToken.symbol }}
            </template>
          </q-td>
          <q-td key="time" :props="props">
            {{ moment(props.row.timestamp).fromNow() }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-card>
</template>


<script>
import { defineComponent } from "vue";
import numeral from "numeral";
import moment from "moment";

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
    formattedTrades() {
      return this.filteredTrades.map((ev) => ({
        title: ev.type,
        usd_value: ev.usd_value,
        sourceAmount: ev.sourceAmount ? ev.sourceAmount : ev.pc_amount,
        sourceToken: ev.sourceAmount
          ? ev.sourceToken
          : ev.pool
          ? ev.pool.pc
          : null,
        targetAmount: ev.targetAmount ? ev.targetAmount : ev.coin_amount,
        targetToken: ev.targetAmount
          ? ev.targetToken
          : ev.pool
          ? ev.pool.coin
          : null,
        owner: ev.owner,
        ...ev,
      }));
    },
  },
  data() {
    return {
      tab: "all",
      moment: moment,
      numeral: numeral,
      eventCols: [
        {
          name: "title",
          field: "title",
          align: "left",
        },
        // {
        //   name: "usd_value",
        //   field: "usd_value",
        //   align: "right",
        //   label: "Total Value",
        //   sortable: true,
        // },
        {
          name: "price",
          field: "price",
          align: "right",
          label: "Price",
          sortable: true,
        },
        {
          name: "sourceAmount",
          field: "sourceAmount",
          align: "right",
          label: "Source",
          sortable: true,
        },
        {
          name: "targetAmount",
          field: "targetAmount",
          align: "right",
          label: "Target",
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
  color: #55dd55;
}
.sell {
  color: #dd5555;
}
</style>