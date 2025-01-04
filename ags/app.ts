// This is placed outside so ags can find the entrypoint
import { COMPILED_STYLE_DIR, resetStyle } from "@utils";
import type { Gdk, Gtk } from "astal/gtk3";
import { App } from "astal/gtk3";

import { Indicators } from "./src/windows";

function forMonitors(window: (gdkmonitor: Gdk.Monitor) => Gtk.Widget) {
  App.get_monitors().map(window);
}

resetStyle();

App.start({
  css: `${COMPILED_STYLE_DIR}/style.css`,
  main() {
    forMonitors(Indicators);
  },
  requestHandler(request, res) {
    if (request == "reset style") {
      resetStyle();
      App.reset_css();
      App.apply_css(`${COMPILED_STYLE_DIR}/style.css`);
      res("Successfully reset style.");
    }
  },
});
