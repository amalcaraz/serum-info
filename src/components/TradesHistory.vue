<template>
  <trades-table :trades="trades" />
</template>

<script>
import { defineComponent } from "vue";
import TradesTable from "./TradesTable.vue";
import tradesQuery from "../queries/trades.gql";
import { client } from "../services/graphql";

export default defineComponent({
  components: { TradesTable },
  props: {
    address: String,
  },
  async setup(props) {
    let result = await client.request(tradesQuery, {
      address: props.address,
    });

    console.log(result);
    return {
      ...result,
    };
  },
});
</script>
