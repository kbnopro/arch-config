import Notifd from "gi://AstalNotifd"
import { Gtk, Widget } from "astal/gtk3"

class Notification {
  private widget: Gtk.Widget
  private notifObject: Notifd.Notification
  constructor({ notifObject, isPopup = false }: {
    notifObject: Notifd.Notification, isPopup?: boolean,
  }) {
    this.notifObject = notifObject
    this.widget = <eventbox
      onHoverLost={this.destroy}
    >
      <box>{notifObject.get_summary()} {notifObject.get_body()}</box>
    </eventbox>

  }
  public get_widget = () => this.widget

  public close = () => { this.widget.destroy() }
  public dismiss = () => {
    this.close()
    this.notifObject.dismiss()
  }
}

export default Notification

