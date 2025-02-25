import type { Widget } from "astal/gtk3";

export const SideModule = ({ ...props }: Widget.BoxProps) => {
  return (
    <box className="bar-sidemodule" {...props}>
    </box>
  );
};
