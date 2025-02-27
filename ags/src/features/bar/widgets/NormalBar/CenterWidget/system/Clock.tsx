import configOptions from "@config";
import { bind, GLib, Variable } from "astal";
import { Gtk } from "astal/gtk3";

import { BarGroup } from "./BarGroup";

const time = Variable("");
time.poll(configOptions.time.interval, () => GLib.DateTime.new_now_local().format(configOptions.time.format) ?? "");

const date = Variable("");
date.poll(configOptions.time.dateInterval, () => GLib.DateTime.new_now_local().format(configOptions.time.dateFormatLong) ?? "");

export const Clock = () => {
  return (
    <BarGroup>
      <box
        valign={Gtk.Align.CENTER}
        className="spacing-h-4 bar-clock-box"
      >
        <label className="bar-time" label={bind(time)} />
        <label className="txt-norm txt-onLayer1" label="•" />
        <label className="txt-smalie bar-date" label={bind(date)} />
      </box>
    </BarGroup>
  );
};
