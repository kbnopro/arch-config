// This is placed outside so ags can find the entrypoint
import { applyStyle } from "@utils";
import { Bar, BarCornerTopLeft, BarCornerTopRight, Indicator } from "@windows";
import type { Gtk } from "astal/gtk3";
import { App, Gdk } from "astal/gtk3";

import { startBatteryWarningService } from "./src/services";

const range = (length: number, start: number = 1) =>
  Array.from({ length }, (_, i) => i + start);
function forMonitors(window: (monitor: number) => Gtk.Widget) {
  const n = Gdk.Display.get_default()?.get_n_monitors() || 1;
  range(n, 0).map(window);
}

startBatteryWarningService();

App.start({
  main() {
    applyStyle();
    forMonitors(Indicator);
    forMonitors(Bar);
    forMonitors(BarCornerTopLeft);
    forMonitors(BarCornerTopRight);
  },
  requestHandler(request, res) {
    if (request == "reset style") {
      applyStyle();
      res("Successfully reset style.");
    }
  },
});
