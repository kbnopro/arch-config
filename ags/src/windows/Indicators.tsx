import { NotificationPopup } from "@notification";
import { Astal, type Gdk } from "astal/gtk3";

export const Indicators = (gdkmonitor: Gdk.Monitor) => {
  return (
    <window
      exclusivity={Astal.Exclusivity.IGNORE}
      name="indicator"
      gdkmonitor={gdkmonitor}
      layer={Astal.Layer.OVERLAY}
      anchor={Astal.WindowAnchor.TOP}
      visible={true}
      className="indicator"
      namespace="indicator"
    >
      <box vertical={true} className="osd-window">
        <NotificationPopup />
      </box>
    </window>
  );
};
