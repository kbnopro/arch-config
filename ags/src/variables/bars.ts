import configOptions from "@config";
import { Variable } from "astal";

const barModes = configOptions.bar.modes;
type BarModes = (typeof barModes)[number];

const getNextMode = (currentMode: BarModes) => {
  const modesCount = barModes.length;
  const idx = barModes.findIndex(value => currentMode === value);
  const nextIdx = (idx + 1) % modesCount;
  return barModes[nextIdx];
};

class Bars {
  private modes = new Map<number, BarModes>();
  public variable = Variable(this.modes);

  getBarMode(monitor: number) {
    const mode = this.modes.get(monitor);
    if (!mode) {
      this.modes.set(monitor, "normal");
      return "normal";
    }
    return mode;
  }

  setBarMode(monitor: number, mode: BarModes) {
    this.modes.set(monitor, mode);
    this.variable.set(this.modes);
  }

  cycleBarMode(monitor: number) {
    const mode = this.getBarMode(monitor);
    const nextMode = getNextMode(mode);
    this.setBarMode(monitor, nextMode);
  }
}

export const barStates = new Bars();
