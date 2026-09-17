import DefaultTheme from "vitepress/theme";
import LayerMap from "./components/LayerMap.vue";
import CalloutGrid from "./components/CalloutGrid.vue";
import "./style.css";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("LayerMap", LayerMap);
    app.component("CalloutGrid", CalloutGrid);
  },
};
