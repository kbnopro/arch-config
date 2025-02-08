import { FocusedBar, NormalBar, NothingBar } from "@bar";
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
