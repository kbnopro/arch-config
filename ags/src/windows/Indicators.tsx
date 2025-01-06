import { NotificationPopup } from "@notification";
import { Astal } from "astal/gtk3";

export const Indicators = (monitor: number) => {
  return (
    <window
      exclusivity={Astal.Exclusivity.IGNORE}
      name={`indicator${monitor.toString()}`}
      monitor={monitor}
      layer={Astal.Layer.OVERLAY}
      anchor={Astal.WindowAnchor.TOP}
      visible={true}
      className="indicator"
    >
      <box vertical={true} className="osd-window">
        <NotificationPopup />
      </box>
    </window>
  );
};
