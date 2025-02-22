import { SideModule } from "@bar";

import { System } from "./system";
import Workspace from "./Workspace";

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
      <System />
    </SideModule>
  </box>
);
