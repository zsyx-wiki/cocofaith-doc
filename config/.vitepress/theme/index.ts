import DefaultTheme from "vitepress/theme";
import LayerMap from "./components/LayerMap.vue";
import CalloutGrid from "./components/CalloutGrid.vue";
import "./style.css";
import CommandTerminal from "./components/CommandTerminal.vue";
import "./terminal-theme.css";
import "./terminal-home.css";
import "./terminal-demo.css";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("CommandTerminal", CommandTerminal);
    app.component("LayerMap", LayerMap);
    app.component("CalloutGrid", CalloutGrid);
  },
};
