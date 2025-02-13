import { SideModule } from "@bar";

import { Indicators } from "./indicators";
import Workspace from "./workspace";

export const CenterWidget = () => (
  <box
    className="spacing-h-4"
  >
    <SideModule></SideModule>
    <box
      homogeneous={true}
    >
      <Workspace />
    </box>
    <SideModule>
      <Indicators />
    </SideModule>
  </box>
);
