import type { NotifData } from "@notification";
import { MaterialIcon } from "@widgets";
import { Gtk } from "astal/gtk3";

export const ExpandButton = ({
  notifData: { expanded },
}: {
  notifData: NotifData;
}) => {
  return (
    <button
      className="notif-expand-btn"
      valign={Gtk.Align.END}
      onClick={() => {
        expanded.set(!expanded.get());
      }}
    >
      <MaterialIcon
        label="expand_more"
        size="small"
        valign={Gtk.Align.CENTER}
        halign={Gtk.Align.CENTER}
        setup={self =>
          self.hook(expanded, (self) => {
            self.set_label(expanded.get() ? "expand_less" : "expand_more");
          })}
      />
    </button>
  );
};
