// This is placed outside so ags can find the entrypoint
import { COMPILED_STYLE_DIR, resetStyle } from "@utils";
import { Indicators } from "@windows";
import type { Gtk } from "astal/gtk3";
import { App, Gdk } from "astal/gtk3";

const range = (length: number, start: number = 1) =>
  Array.from({ length }, (_, i) => i + start);
function forMonitors(window: (monitor: number) => Gtk.Widget) {
  const n = Gdk.Display.get_default()?.get_n_monitors() || 1;
  range(n, 0).map(window);
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
