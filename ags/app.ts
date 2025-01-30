// This is placed outside so ags can find the entrypoint
import { applyStyle } from "@utils";
import { Indicator } from "@windows";
import type { Gtk } from "astal/gtk3";
import { App, Gdk } from "astal/gtk3";

const range = (length: number, start: number = 1) =>
  Array.from({ length }, (_, i) => i + start);
function forMonitors(window: (monitor: number) => Gtk.Widget) {
  const n = Gdk.Display.get_default()?.get_n_monitors() || 1;
  range(n, 0).map(window);
}

App.start({
  main() {
    applyStyle();
    forMonitors(Indicator);
  },
  requestHandler(request, res) {
    if (request == "reset style") {
      applyStyle();
      res("Successfully reset style.");
    }
  },
});
