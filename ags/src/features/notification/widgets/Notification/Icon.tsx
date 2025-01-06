import { getUrgency, type NotifData } from "@notification";
import { Astal, Gtk } from "astal/gtk3";

import { MaterialIcon } from "@/src/widgets";

const guessMessageType = (summary: string) => {
  const str = summary.toLowerCase();
  if (str.includes("reboot")) return "restart_alt";
  if (str.includes("recording")) return "screen_record";
  if (str.includes("battery") || summary.includes("power")) return "power";
  if (str.includes("screenshot")) return "screenshot_monitor";
  if (str.includes("welcome")) return "waving_hand";
  if (str.includes("time")) return "scheduleb";
  if (str.includes("installed")) return "download";
  if (str.includes("update")) return "update";
  if (str.startsWith("file")) return "folder_copy";
  return "chat";
};

const IconChild = ({
  notifData: { notifObject },
}: {
  notifData: NotifData;
}) => {
  const appName = notifObject.get_app_name();
  if (Astal.Icon.lookup_icon(appName))
    return <icon icon={appName} valign={Gtk.Align.CENTER} />;

  const appIcon = notifObject.get_app_icon();
  if (Astal.Icon.lookup_icon(appIcon))
    return <icon icon={appIcon} valign={Gtk.Align.CENTER} />;

  const icon
    = getUrgency(notifObject) == "critical"
      ? "release_alert"
      : guessMessageType(notifObject.get_summary());

  return <MaterialIcon label={icon} size="hugeass" hexpand={true} />;
};

export const Icon = ({ notifData }: { notifData: NotifData }) => {
  const { notifObject } = notifData;
  const imagePath = notifObject.get_image();
  if (imagePath) {
    return (
      <box
        valign={Gtk.Align.CENTER}
        hexpand={false}
        className="notif-icon"
        css={`
          background-image: url("${imagePath}");
          background-size: auto 100%;
          background-repeat: no-repeat;
          background-position: center;
        `}
      />
    );
  }

  const urgency = getUrgency(notifObject);
  return (
    <box
      valign={Gtk.Align.CENTER}
      hexpand={false}
      className={`notif-icon notif-icon-material-${urgency}`}
      homogeneous={true}
    >
      <IconChild notifData={notifData} />
    </box>
  );
};
