import { Gtk } from "astal/gtk3";
import clsx from "clsx";
import AstalBattery from "gi://AstalBattery";

import configOptions from "@/src/config";
import { MaterialIcon } from "@/src/widgets";

import { BarGroup } from "./BarGroup";

const battery = AstalBattery.get_default();

export const Battery = () => {
  const criticalThreshold = configOptions.battery.critical;
  const isCritical = () => {
    return battery.percentage * 100 <= criticalThreshold && !battery.charging;
  };
  return (
    <BarGroup>
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
            className={clsx("bar-batt", isCritical() && "bar-batt-low")}
            valign={Gtk.Align.CENTER}
            homogeneous={true}
            setup={self => self
              .hook(battery, "notify::percentage", (self) => {
                self.toggleClassName("bar-batt-low", isCritical());
              })
              .hook(battery, "notify::charging", (self) => {
                self.toggleClassName("bar-batt-low", isCritical());
              })}
          >
            <MaterialIcon label="battery_full" size="small" />
          </box>
          <circularprogress
            className={clsx("overlay bar-batt-circprog", isCritical() && "bar-batt-circprog-low")}
            startAt={-0.25}
            endAt={0.75}
            value={battery.percentage}
            setup={self => self
              .hook(battery, "notify::percentage", (self) => {
                self.toggleClassName("bar-batt-circprog-low", isCritical());
                self.set_value(battery.percentage);
              })
              .hook(battery, "notify::charging", (self) => {
                self.toggleClassName("bar-batt-circprog-low", isCritical());
                self.set_value(battery.percentage);
              })}

          />
        </overlay>
      </box>
    </BarGroup>
  );
};
