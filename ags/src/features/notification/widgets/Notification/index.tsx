import configOptions from "@config";
import { getUrgency, type NotifData } from "@notification";
import { bind, timeout, Variable } from "astal";
import { Gtk } from "astal/gtk3";
import Notifd from "gi://AstalNotifd";

import { Content } from "./Content";
import { Summary } from "./Summary";

export class Notification {
  private widget: Gtk.Widget;
  private notifData: NotifData;
  constructor(notifData: NotifData) {
    this.notifData = notifData;
    const { isPopup, notifObject } = notifData;
    const urgency = getUrgency(notifObject);
    const revealed = Variable(false);
    const revealTimer = timeout(20, () => {
      revealed.set(true);
    });
    let notifTimeOut = notifObject.get_expire_timeout();
    if (notifTimeOut == -1) {
      // This is the case when timeout is not set by application
      notifTimeOut
        = getUrgency(notifData.notifObject) == "critical" ? 8000 : 3000;
    }
    // Checking the behaviour, either notify-send or Notifd actually handle the timeout
    // However, it safe to implement this ourself just in case
    const timeoutTimer = timeout(notifTimeOut, () => {
      this.close();
    });

    this.widget = (
      <revealer
        onDestroy={() => {
          revealTimer.cancel();
          timeoutTimer.cancel();
        }}
        revealChild={bind(revealed)}
        transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
        transitionDuration={configOptions.animations.durationLarge}
      >
        <box homogeneous={true}>
          <eventbox
            onHoverLost={() => {
              // On hover lost should behave similar to expired signall
              if (isPopup) this.close();
            }}
          >
            <box homogeneous={true}>
              <box
                className={`${isPopup ? "popup-" : ""}notif-${urgency} spacing-h-10`}
              >
                <box className="spacing-h-5">
                  <box vertical={true} valign={Gtk.Align.CENTER} hexpand={true}>
                    <Summary notifData={notifData} />
                    <Content notifData={notifData} />
                  </box>
                </box>
              </box>
            </box>
          </eventbox>
        </box>
      </revealer>
    );
  }

  public getWidget = () => this.widget;
  public close = (
    reason: Notifd.ClosedReason = Notifd.ClosedReason.UNDEFINED,
  ) => {
    // The non-popup notification should not be closed when notification expired
    // This expiration is triggered by notify-send
    if (reason == Notifd.ClosedReason.EXPIRED && !this.notifData.isPopup)
      return false;
    this.widget.destroy();
    return true;
    // Return whether the widget is closed or not
  };
}
