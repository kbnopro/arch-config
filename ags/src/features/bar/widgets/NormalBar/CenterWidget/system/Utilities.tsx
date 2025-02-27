import { execAsync, GLib } from "astal";
import type { Widget } from "astal/gtk3";
import { Gtk } from "astal/gtk3";

import { MaterialIcon } from "@/src/widgets";

import { BarGroup } from "./BarGroup";

const UtilButton = ({ label, ...props }: Widget.ButtonProps) => (
  <button
    valign={Gtk.Align.CENTER}
    className="bar-util-btn"
    {...props}
  >
    <MaterialIcon label={label} size="norm" />
  </button>
);

export const Utilities = () => (
  <BarGroup>
    <box
      halign={Gtk.Align.CENTER}
      className="spacing-h-4"
    >
      <UtilButton
        label="screenshot_region"
        tooltipText="Screen Snip"
        onClicked={() => {
          execAsync(`bash ${GLib.get_user_config_dir()}/ags/scripts/grimblast.sh -f -n copy area`).catch(print);
        }}
      />
      <UtilButton
        label="colorize"
        tooltipText="Color Picker"
        onClick={() => {
          execAsync(["hyprpicker", "--render-inactive", "-a"]).catch(print);
        }}
      >
      </UtilButton>
    </box>
  </BarGroup>
);
