import type { Gtk } from "astal/gtk3";

export const SideModule = (children: Gtk.Widget) => (
  <box className="bar-sidemodule">
    {children}
  </box>
);
