<template>
  <events-table :events="events" />
</template>

<script>
import { defineComponent } from "vue";
import EventsTable from "./EventsTable.vue";
import tradesQuery from "../queries/trades.gql";
import { client } from "../services/graphql";

export default defineComponent({
  components: { EventsTable },
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
