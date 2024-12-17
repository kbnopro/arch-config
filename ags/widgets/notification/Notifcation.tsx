import Notifd from "gi://AstalNotifd"
import { Gtk } from "astal/gtk3"
import GLib from "gi://GLib?version=2.0"
import configOptions from "@config"

const NotifSummaryText = ({ notifObject }: { notifObject: Notifd.Notification }) => {
  const summary = notifObject.get_summary()
  return <label
    xalign={0}
    hexpand={true}
    className={"txt-small txt-semibold titlefont"}
    justify={Gtk.Justification.LEFT}
    truncate={true}
    ellipsize={3}
    useMarkup={summary.startsWith("<")}
    label={summary}
  />
}

const getTimeString = (time: number) => {
  const sendTime = GLib.DateTime.new_from_unix_local(time)
  const now = GLib.DateTime.new_now_local()
  const oneMinuteAgo = now.add_seconds(-6)
  const today = now.get_day_of_year()
  if (!oneMinuteAgo) return "Error calculating time"
  if (sendTime.compare(oneMinuteAgo) > 0) return "Now"
  if (sendTime.get_day_of_year() == today) return sendTime.format(configOptions.time.format) ?? "Error in time format"
  if (sendTime.get_day_of_year() == today - 1) return "Yesterday"
  return sendTime.format(configOptions.time.dateFormat) ?? "Error in time format"
}

const NotifSummaryTime = ({ notifObject }: { notifObject: Notifd.Notification }) => {
  const time = notifObject.get_time()
  const timeString = getTimeString(time)
  return <label
    justify={Gtk.Justification.RIGHT}
    className={"txt-smaller txt-semibold"}
    label={timeString}
    setup={(self) => {
      if (timeString == 'Now') {
        let id = GLib.timeout_add(0, 6000, () => {
          self.label = getTimeString(time)
          return false
        })
        self.connect("destroy", () => { GLib.source_remove(id) })
      }
    }}
  />
}

const NotifSummary = ({ notifObject }: { notifObject: Notifd.Notification }) => {
  return <box
    vertical={false}
  >
    <NotifSummaryText notifObject={notifObject} />
    <NotifSummaryTime notifObject={notifObject} />
  </box>

}

const NotifContent = ({ notifObject, isPopup }: { notifObject: Notifd.Notification, isPopup: boolean }) => {

  return <box
    className={`${isPopup ? "popup-" : ""}notif-low`}
  >
    <NotifSummary notifObject={notifObject} />
  </box>
}

class Notification {
  private widget: Gtk.Widget
  private notifObject: Notifd.Notification
  constructor({ notifObject, isPopup = false }: {
    notifObject: Notifd.Notification, isPopup?: boolean,
  }) {
    this.notifObject = notifObject
    this.widget = <eventbox
      onHoverLost={this.close}
    >
      <NotifContent notifObject={notifObject} isPopup={isPopup} />
    </eventbox>
  }
  public get_widget = () => this.widget
  public close = () => { this.widget.destroy() }
  public dismiss = () => { this.notifObject.dismiss() }
}

export default Notification

