import type { Widget } from "astal/gtk3";
import { Gtk } from "astal/gtk3";
import { timeout } from "astal/time";
import type giCairo from "cairo";

const { START, END } = Gtk.Align;

export const RoundedCorner = ({ place, ...props }: { place: "topleft" | "topright" | "bottomleft" | "bottomright" } & Partial<Widget.DrawingAreaProps>) => {
  return (
    <drawingarea
      halign={place.includes("left") ? START : END}
      valign={place.includes("top") ? START : END}

      setup={(self) => {
        timeout(1, () => {
          const c = self.get_style_context().get_property("background-color", Gtk.StateFlags.NORMAL) as { red: number; green: number; blue: number; alpha: number };
          const r = self.get_style_context().get_property("border-radius", Gtk.StateFlags.NORMAL) as number;
          self.set_size_request(r, r);
          return self.hook(self, "draw", (widget, cr: giCairo.Context) => {
            // const borderColor = widget.get_style_context().get_property('color', Gtk.StateFlags.NORMAL);
            // const borderWidth = widget.get_style_context().get_border(Gtk.StateFlags.NORMAL).left; // ur going to write border-width: something anyway
            widget.set_size_request(r, r);

            switch (place) {
              case "topleft":
                cr.arc(r, r, r, Math.PI, 3 * Math.PI / 2);
                cr.lineTo(0, 0);
                break;

              case "topright":
                cr.arc(0, r, r, 3 * Math.PI / 2, 2 * Math.PI);
                cr.lineTo(r, 0);
                break;

              case "bottomleft":
                cr.arc(r, 0, r, Math.PI / 2, Math.PI);
                cr.lineTo(0, r);
                break;

              case "bottomright":
                cr.arc(0, 0, r, 0, Math.PI / 2);
                cr.lineTo(r, r);
                break;
            }

            cr.closePath();
            cr.setSourceRGBA(c.red, c.green, c.blue, c.alpha);
            cr.fill();
            // cr.setLineWidth(borderWidth);
            // cr.setSourceRGBA(borderColor.red, borderColor.green, borderColor.blue, borderColor.alpha);
            // cr.stroke();
          });
        });
      }}
      {...props}
    >

    </drawingarea>
  );
};
