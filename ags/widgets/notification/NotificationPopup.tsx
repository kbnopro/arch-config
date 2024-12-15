import { Astal, Gtk, Gdk } from "astal/gtk3"
import { Subscribable } from "astal/binding";
import { Variable } from "astal"
import Notifd from "gi://AstalNotifd"
import Notification from "./Notifcation"

class NotificationMap {
  private notifd: Notifd.Notifd = Notifd.get_default()
  private map: Map<number, Notification> = new Map()
  constuctor() {

  }
  public notify = (id: number) => {
    const notifObject = this.notifd.get_notification(id)
    const notification = new Notification({
      notifObject: notifObject,
      isPopup: true
    })
    this.map.set(id, notification)
    return notification.get_widget()
  }
  public resolve = (id: number) => {
    const notification = this.map.get(id)
    if (!notification) return
    notification.close()
    this.map.delete(id)
  }
  public get_notifd = () => this.notifd
}


export default (gdkmonitor: Gdk.Monitor) => {
  const notificationMap = new NotificationMap()
  const notifd = notificationMap.get_notifd()

  return <window
    gdkmonitor={gdkmonitor}
  >
    <box
      vertical={true}
      setup={
        (self) => self
          .hook(notifd, "notified", (box, id: number) => {
            box.pack_end(notificationMap.notify(id), false, false, 0)
            box.show_all()
          })
          .hook(notifd, "resolved", (_box, id: number, _reason: Notifd.ClosedReason) => { notificationMap.resolve(id) })
      }
    >
    </box>
  </window>


}







