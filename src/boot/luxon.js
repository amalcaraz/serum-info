import { boot } from 'quasar/wrappers'
import { Settings } from "luxon";

export default boot(({ app }) => {
  Settings.defaultZone = "utc";
})
