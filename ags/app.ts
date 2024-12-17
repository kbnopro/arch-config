import { App, Gtk, Gdk } from "astal/gtk3"
import Notification from "./widgets/notification/NotificationPopup"
import { COMPILED_STYLE_DIR, resetStyle } from "./resetStyle"
import _configOptions from "./config"

function forMonitors(window: (gdkmonitor: Gdk.Monitor) => Gtk.Widget) {
  App.get_monitors().map(window)
}

resetStyle()

App.start({
  css: `${COMPILED_STYLE_DIR}/style.css`,
  main() {
    forMonitors(Notification)
  },
  requestHandler(request, res) {
    if (request == "reset style") {
      resetStyle()
      App.reset_css()
      App.apply_css(`${COMPILED_STYLE_DIR}/style.css`)
      res("Successfully reset style.")
    }
  }
})
