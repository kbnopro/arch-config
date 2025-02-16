import { CenterWidget } from "./centerWidget";

export const NormalBar = ({ monitor: _monitor, name }: { monitor: number; name: string }) => (
  <centerbox
    name={name}
    className="bar-bg"
  >
    <box></box>
    <CenterWidget />
    <box></box>
  </centerbox>
);
