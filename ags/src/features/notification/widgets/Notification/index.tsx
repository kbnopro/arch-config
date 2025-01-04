import configOptions from "@config";
import { getUrgency, type NotifData } from "@notification";
import { bind, timeout, Variable } from "astal";
import { Gtk } from "astal/gtk3";

import { Content } from "./Content";
import { Summary } from "./Summary";

export class Notification {
  private widget: Gtk.Widget;
  private notifData: NotifData;
  constructor(notifData: NotifData) {
    this.notifData = notifData;
    const { notifObject } = notifData;
    const { isPopup } = notifData;
    const urgency = getUrgency(notifObject);
    const revealed = Variable(false);
    const revealTimer = timeout(20, () => {
      revealed.set(true);
    });

    this.widget = (
      <revealer
        onDestroy={() => {
          revealTimer.cancel();
        }}
        revealChild={bind(revealed)}
        transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
        transitionDuration={configOptions.animations.durationLarge}
      >
        <box homogeneous={true}>
          <eventbox
            onHoverLost={() => {
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
  public close = () => {
    this.widget.destroy();
  };
}
