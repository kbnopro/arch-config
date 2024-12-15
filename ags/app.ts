import { App, Gtk, Gdk } from "astal/gtk3"
import { exec } from "astal/process"
import Notification from "./widgets/notification/NotificationPopup"

function forMonitors(window: (gdkmonitor: Gdk.Monitor) => Gtk.Widget) {
  App.get_monitors().map(window)
}

exec("sass ./scss/main.scss ./main.css")

App.start({
  css: "./main.css",
  main() {
    forMonitors(Notification)
  },
})
