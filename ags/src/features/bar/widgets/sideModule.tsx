import type { Gtk } from "astal/gtk3";

export const SideModule = ({ children }: { children?: Gtk.Widget }) => (
  <box className="bar-sidemodule">
    {children}
  </box>
);
