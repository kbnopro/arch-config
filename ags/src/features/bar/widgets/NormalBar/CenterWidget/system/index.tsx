import { Battery } from "./Battery";
import { Clock } from "./Clock";
import { Utilities } from "./Utilities";

export const System = () => {
  return (
    <eventbox>
      <box className="spacing-h-4">
        <Clock />
        <Utilities />
        <Battery />
      </box>
    </eventbox>
  );
};
