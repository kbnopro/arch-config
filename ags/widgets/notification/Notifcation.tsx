import Notifd from "gi://AstalNotifd";
import { Gtk, Astal, Widget } from "astal/gtk3";
import GLib from "gi://GLib?version=2.0";
import configOptions from "@config";
import { MaterialIcon } from "@shared/widgets";
import Variable from "../../../../../../usr/share/astal/gjs/variable";

const NotifSummaryText = ({
  notifObject,
}: {
  notifObject: Notifd.Notification;
}) => {
  const summary = notifObject.get_summary();
  return (
    <label
      xalign={0}
      hexpand={true}
      className={"txt-small txt-semibold titlefont"}
      justify={Gtk.Justification.LEFT}
      truncate={true}
      ellipsize={3}
      useMarkup={summary.startsWith("<")}
      label={summary}
    />
  );
};

const getTimeString = (time: number) => {
  const sendTime = GLib.DateTime.new_from_unix_local(time);
  const now = GLib.DateTime.new_now_local();
  const oneMinuteAgo = now.add_seconds(-60);
  const today = now.get_day_of_year();
  if (!oneMinuteAgo) return "Error calculating time";
  if (sendTime.compare(oneMinuteAgo) > 0) return "Now";
  if (sendTime.get_day_of_year() == today)
    return sendTime.format(configOptions.time.format) ?? "Error in time format";
  if (sendTime.get_day_of_year() == today - 1) return "Yesterday";
  return (
    sendTime.format(configOptions.time.dateFormat) ?? "Error in time format"
  );
};

const NotifSummaryTime = ({
  notifObject,
}: {
  notifObject: Notifd.Notification;
}) => {
  const time = notifObject.get_time();
  const timeString = getTimeString(time);
  return (
    <label
      justify={Gtk.Justification.RIGHT}
      className={"txt-smaller txt-semibold"}
      label={timeString}
      setup={(self) => {
        if (timeString == "Now") {
          let id = GLib.timeout_add(0, 60000, () => {
            self.label = getTimeString(time);
            return false;
          });
          self.connect("destroy", () => {
            GLib.source_remove(id);
          });
        }
      }}
    />
  );
};

const NotifExpandButton = ({
  ...props
}: Omit<Widget.ButtonProps, "className" | "label">) => (
  <button className={"notif-expand-btn"} valign={Gtk.Align.END} {...props}>
    <MaterialIcon
      icon={"expand_more"}
      size={"small"}
      valign={Gtk.Align.CENTER}
      halign={Gtk.Align.CENTER}
    />
  </button>
);

const NotifSummary = ({
  notifObject,
  onClickExpandButton,
}: {
  notifObject: Notifd.Notification;
  onClickExpandButton: Widget.ButtonProps["onClick"];
}) => {
  return (
    <box vertical={false}>
      <NotifSummaryText notifObject={notifObject} />
      <box className={"spacing-h-5"}>
        <NotifSummaryTime notifObject={notifObject} />
        <NotifExpandButton onClick={onClickExpandButton} />
      </box>
    </box>
  );
};

const getUrgency = (notifObject: Notifd.Notification) => {
  const urgency = notifObject.get_urgency();
  const { LOW, NORMAL, CRITICAL } = Notifd.Urgency;
  switch (urgency) {
    case LOW:
      return "low";
    case CRITICAL:
      return "critical";
    case NORMAL:
    default:
      return "normal";
  }
};

const NotifTextPreview = ({
  notifObject,
  ...props
}: {
  notifObject: Notifd.Notification;
} & Widget.RevealerProps) => {
  const body = notifObject.get_body();
  const urgency = getUrgency(notifObject);
  return (
    <revealer
      transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
      transitionDuration={configOptions.animations.durationSmall}
      revealChild={true}
      {...props}
    >
      <label
        xalign={0}
        className={`txt-smallie notif-body-${urgency}`}
        useMarkup={true}
        justify={Gtk.Justification.LEFT}
        maxWidthChars={1}
        truncate={true}
        label={body.split("\n")[0]}
      />
    </revealer>
  );
};

const NotifTextExpanded = ({
  notifObject,
  ...props
}: {
  notifObject: Notifd.Notification;
} & Widget.RevealerProps) => {
  const body = notifObject.get_body();
  const urgency = getUrgency(notifObject);
  const actions = notifObject.get_actions();
  return (
    <revealer
      transitionType={Gtk.RevealerTransitionType.SLIDE_UP}
      transitionDuration={configOptions.animations.durationSmall}
      revealChild={false}
      {...props}
    >
      <box vertical={true} className={"spacing-v-10"}>
        <label
          xalign={0}
          className={`txt-smallie notif-body-${urgency}`}
          useMarkup={true}
          justify={Gtk.Justification.LEFT}
          maxWidthChars={1}
          wrap={true}
          label={body}
        />
        <box className={"notif-actions spacing-h-5"}>
          <button
            hexpand={true}
            className={`notif-action notif-action-${urgency}`}
            onClick={() => {
              notifObject.dismiss();
            }}
          >
            <label label={"Close"} />
          </button>
          {...actions.map((action) => (
            <button
              hexpand={true}
              className={`notif-action notif-action-${urgency}`}
              onClick={() => notifObject.invoke(action.id)}
            >
              <label label={action.label} />
            </button>
          ))}
        </box>
      </box>
    </revealer>
  );
};

const NotifText = ({
  notifObject,
  setup,
  onClickExpandButton,
}: {
  notifObject: Notifd.Notification;
  setup: Widget.RevealerProps["setup"];
  onClickExpandButton: Widget.ButtonProps["onClick"];
}) => {
  return (
    <box vertical={true} valign={Gtk.Align.CENTER} hexpand={true}>
      <NotifSummary
        notifObject={notifObject}
        onClickExpandButton={onClickExpandButton}
      />
      <NotifTextPreview notifObject={notifObject} />
      <NotifTextExpanded notifObject={notifObject} setup={setup} />
    </box>
  );
};

const NotifContent = ({
  notifObject,
  isPopup,
  ...props
}: {
  notifObject: Notifd.Notification;
  isPopup: boolean;
} & Partial<Omit<Astal.Box.ConstructorProps, "className">>) => {
  const urgency = getUrgency(notifObject);
  const expanded = Variable(false);
  const onClickExpandButton = (self: Astal.Button) => {
    expanded.set(!expanded.get());
    const icon = expanded.get() ? "expand_less" : "expand_more";
    (self.get_child() as Widget.Label).label = icon;
  };
  return (
    <box
      className={`${isPopup ? "popup-" : ""}notif-${urgency} spacing-h-10`}
      {...props}
    >
      <box className={"spacing-h-5"}>
        <NotifText
          onClickExpandButton={onClickExpandButton}
          notifObject={notifObject}
          setup={(self) =>
            self.hook(expanded, (self) => {
              self.set_reveal_child(!self.get_reveal_child());
            })
          }
        />
      </box>
    </box>
  );
};

class Notification {
  private widget: Gtk.Widget;
  private notifObject: Notifd.Notification;
  private isPopup: boolean;
  constructor({
    notifObject,
    isPopup = false,
  }: {
    notifObject: Notifd.Notification;
    isPopup?: boolean;
  }) {
    this.notifObject = notifObject;
    this.isPopup = isPopup;
    this.widget = (
      <revealer
        revealChild={true}
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
              <NotifContent notifObject={notifObject} isPopup={isPopup} />
            </box>
          </eventbox>
        </box>
      </revealer>
    );
  }
  public getWidget = () => this.widget;
  public close = () => this.widget.destroy();
}

export default Notification;
