import { FocusedBar, NormalBar, NothingBar, RoundedCorner } from "@bar";
import configOptions from "@config";
import { barStates } from "@variables";
import { Astal, Gtk } from "astal/gtk3";

const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;

export const Bar = (monitor: number) => {
  return (
    <window
      monitor={monitor}
      anchor={TOP | LEFT | RIGHT}
      name={`bar${monitor.toString()}`}
      namespace={`bar${monitor.toString()}`}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      visible={true}
    >
      <stack
        homogeneous={false}
        transitionType={Gtk.StackTransitionType.SLIDE_UP_DOWN}
        transitionDuration={configOptions.animations.durationLarge}
        setup={(self) => {
          self.set_visible_child_name(barStates.getBarMode(monitor));
          return self
            .hook(barStates.variable, () => {
              self.set_visible_child_name(barStates.getBarMode(monitor));
            });
        }}
      >
        <NormalBar monitor={monitor} name="normal" />
        <FocusedBar monitor={monitor} name="focused" />
        <NothingBar name="nothing" />
      </stack>
    </window>
  );
};

export const BarCornerTopLeft = (monitor: number) => {
  return (
    <window
      monitor={monitor}
      name={`barcornerctl${monitor.toString()}`}
      namespace={`barcornerctl${monitor.toString()}`}
      anchor={TOP | LEFT}
      exclusivity={Astal.Exclusivity.NORMAL}
      visible={true}
    >
      <RoundedCorner place="topleft" className="corner" />
    </window>
  );
};

export const BarCornerTopRight = (monitor: number) => {
  return (
    <window
      monitor={monitor}
      name={`barcornerctr${monitor.toString()}`}
      namespace={`barcornerctr${monitor.toString()}`}
      anchor={TOP | RIGHT}
      exclusivity={Astal.Exclusivity.NORMAL}
      visible={true}
    >
      <RoundedCorner place="topright" className="corner" />
    </window>
  );
};
