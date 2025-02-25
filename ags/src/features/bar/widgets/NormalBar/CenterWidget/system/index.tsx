import { BarGroup } from "./BarGroup";
import { Battery } from "./Battery";

export const System = () => {
  return (
    <eventbox>
      <box className="spacing-h-4">
        <BarGroup>
          <Battery />
        </BarGroup>
      </box>
    </eventbox>
  );
};
