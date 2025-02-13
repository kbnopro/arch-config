import { Gdk, Gtk } from "astal/gtk3";
import Pango from "gi://Pango?version=1.0";
import PangoCairo from "gi://PangoCairo?version=1.0";

// Not shown. Only for getting size props
const dummyWs = <box className="bar-ws" />;
const dummyActiveWs = <box className="bar-ws bar-ws-active" />;
const dummyOccupiedWs = <box className="bar-ws bar-ws-occupied" />;

const mix = (value1: number, value2: number, perc: number) => {
  return value1 * perc + value2 * (1 - perc);
};

const getFontWeightName = (weight: Pango.Weight) => {
  switch (weight) {
    case Pango.Weight.ULTRALIGHT:
      return "UltraLight";
    case Pango.Weight.LIGHT:
      return "Light";
    case Pango.Weight.NORMAL:
      return "Normal";
    case Pango.Weight.BOLD:
      return "Bold";
    case Pango.Weight.ULTRABOLD:
      return "UltraBold";
    case Pango.Weight.HEAVY:
      return "Heavy";
    default:
      return "Normal";
  }
};

// Font size = workspace id
const WorkspaceContents = (count = 10) => {

};

export default () => {
  return (
    <eventbox>
    </eventbox>
  );
};
