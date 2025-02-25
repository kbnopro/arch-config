import { Gtk } from "astal/gtk3";
import clsx from "clsx";
import AstalBattery from "gi://AstalBattery";

import configOptions from "@/src/config";
import { MaterialIcon } from "@/src/widgets";

const battery = AstalBattery.get_default();

export const Battery = () => {
  const criticalThreshold = configOptions.battery.critical;
  const isCritical = battery.percentage * 100 <= criticalThreshold;
  return (
    <box className="spacing-h-4 bar-batt-txt">
      <revealer
        transitionDuration={configOptions.animations.durationSmall}
        revealChild={battery.charging}
        transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
        setup={self => self
          .hook(battery, "notify::charging", (self) => {
            self.revealChild = battery.charging;
          })}
      >
        <MaterialIcon label="bolt" size="norm" tooltipText="Charging" />
      </revealer>
      <label
        className="txt-smallie"
        setup={self => self
          .hook(battery, "notify::percentage", (self) => {
            self.label = `${(battery.percentage * 100).toFixed(0)}%`;
          })}
        label={`${(battery.percentage * 100).toFixed(0)}%`}
      />
      <overlay>
        <box
          className={clsx("bar-batt", isCritical && "bar-batt-low")}
          valign={Gtk.Align.CENTER}
          homogeneous={true}
          setup={self => self.hook(battery, "notify::percentage", (self) => {
            self.toggleClassName("bar-batt-low", battery.percentage * 100 <= configOptions.battery.critical);
          })}
        >
          <MaterialIcon label="battery_full" size="small" />
        </box>
        <circularprogress
          className={clsx("overlay bar-batt-circprog", isCritical && "bar-batt-circprog-low")}
          startAt={-0.25}
          endAt={0.75}
          value={battery.percentage}
          setup={self => self
            .hook(battery, "notify::percentage", (self) => {
              self.toggleClassName("bar-batt-circprog-low", battery.percentage * 100 <= configOptions.battery.critical);
            })}
        />
      </overlay>
    </box>
  );
};
