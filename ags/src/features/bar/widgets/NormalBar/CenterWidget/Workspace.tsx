import configOptions from "@config";
import { execAsync, GLib } from "astal";
import { Gdk, Gtk } from "astal/gtk3";
import type { DrawingArea } from "astal/gtk3/widget";
import giCairo from "cairo";
import Hyprland from "gi://AstalHyprland";
import Pango from "gi://Pango";
import PangoCairo from "gi://PangoCairo?version=1.0";

import type { cssColor } from "@/src/types";

// Not shown. Only for getting size props
const dummyWs = <box className="bar-ws" />;
const dummyActiveWs = <box className="bar-ws bar-ws-active" />;
const dummyOccupiedWs = <box className="bar-ws bar-ws-occupied" />;

const mix = (value1: number, value2: number, perc: number) => {
  return value1 * perc + value2 * (1 - perc);
};

const getFontWeightName = (weight: Pango.Weight) => {
  switch (weight) {
    case Pango.Weight.ULTRALIGHT:
      return "UltraLight";
    case Pango.Weight.LIGHT:
      return "Light";
    case Pango.Weight.NORMAL:
      return "Normal";
    case Pango.Weight.BOLD:
      return "Bold";
    case Pango.Weight.ULTRABOLD:
      return "UltraBold";
    case Pango.Weight.HEAVY:
      return "Heavy";
    default:
      return "Normal";
  }
};

const hyprland = Hyprland.get_default();

// Font size = workspace id
const WorkspaceContents = () => {
  // number of workspace shown
  const count = 10;
  let workspaceInfo = {
    group: 0,
    mask: 0,
  };

  const updateMask = () => {
    const activeWorkspace = hyprland.get_focused_workspace();
    const newGroup = Math.floor((activeWorkspace.id - 1) / count);
    const offset = newGroup * 10;
    let newMask = 0;
    const workspaces = hyprland.get_workspaces();
    workspaces.forEach(({ id, clients }) => {
      if (id <= offset || id > offset + count) return;
      if (clients.length > 0) newMask |= (1 << (id - offset));
    });
    workspaceInfo = {
      group: newGroup,
      mask: newMask,
    };
  };

  updateMask();

  const updateWorkspace = (self: DrawingArea) => {
    updateMask();
    self.queue_draw();
  };

  return (
    <drawingarea
      className="bar-ws-container"
      setup={self => self
        .hook(hyprland, "notify::focused-workspace", updateWorkspace)
        .hook(hyprland, "client-moved", updateWorkspace)
        .hook(self, "draw", (self, cr: giCairo.Context) => {
          const activeWorspace = hyprland.get_focused_workspace();
          const offset = Math.floor((activeWorspace.id - 1) / count) * count;

          const allocation = self.get_allocation();
          const { height } = allocation;

          const workspaceStyleContext = dummyWs.get_style_context();
          const workspaceDiameter = workspaceStyleContext.get_property("min-width", Gtk.StateFlags.NORMAL) as number;
          const workspaceRadius = workspaceDiameter / 2;
          const workspaceFontSize = workspaceStyleContext.get_property("font-size", Gtk.StateFlags.NORMAL) as number / 4 * 3;
          const workspaceFontFamily = workspaceStyleContext.get_property("font-family", Gtk.StateFlags.NORMAL) as string[];
          const workspaceFontWeight = workspaceStyleContext.get_property("font-weight", Gtk.StateFlags.NORMAL) as number;
          const wsfg = workspaceStyleContext.get_property("color", Gtk.StateFlags.NORMAL) as cssColor;

          const occupiedWorkspaceStyleContext = dummyOccupiedWs.get_style_context();
          const occupiedbg = occupiedWorkspaceStyleContext.get_property("background-color", Gtk.StateFlags.NORMAL) as cssColor;
          const occupiedfg = occupiedWorkspaceStyleContext.get_property("color", Gtk.StateFlags.NORMAL) as cssColor;

          const activeWorkspaceStyleContext = dummyActiveWs.get_style_context();
          const activebg = activeWorkspaceStyleContext.get_property("background-color", Gtk.StateFlags.NORMAL) as cssColor;
          const activefg = activeWorkspaceStyleContext.get_property("color", Gtk.StateFlags.NORMAL) as cssColor;
          self.set_size_request(workspaceDiameter * count, -1);
          const activeWs = activeWorspace.id;

          const activeWsCenterX = -(workspaceDiameter / 2) + (workspaceDiameter * activeWs);
          const activeWsCenterY = height / 2;

          // Font
          const layout = PangoCairo.create_layout(cr);
          const fontDesc = Pango.font_description_from_string(`${workspaceFontFamily[0]} ${getFontWeightName(workspaceFontWeight)} ${workspaceFontSize.toString()}`);
          layout.set_font_description(fontDesc);
          cr.setAntialias(giCairo.Antialias.BEST);
          // Get kinda min radius for number indicators
          layout.set_text("0".repeat(count.toString().length), -1);
          const [layoutWidth, layoutHeight] = layout.get_pixel_size();
          const indicatorRadius = Math.max(layoutWidth, layoutHeight) / 2 * 1.15; // smaller than sqrt(2)*radius

          for (let i = 1; i <= count; i++) {
            if (workspaceInfo.mask & (1 << i)) {
              // Draw bg highlight
              cr.setSourceRGBA(occupiedbg.red, occupiedbg.green, occupiedbg.blue, occupiedbg.alpha);
              const wsCenterX = -(workspaceRadius) + (workspaceDiameter * i);
              const wsCenterY = height / 2;
              if (!(workspaceInfo.mask & (1 << (i - 1)))) { // Left
                cr.arc(wsCenterX, wsCenterY, workspaceRadius, 0.5 * Math.PI, 1.5 * Math.PI);
                cr.fill();
              }
              else {
                cr.rectangle(wsCenterX - workspaceRadius, wsCenterY - workspaceRadius, workspaceRadius, workspaceRadius * 2);
                cr.fill();
              }
              if (!(workspaceInfo.mask & (1 << (i + 1)))) { // Right
                cr.arc(wsCenterX, wsCenterY, workspaceRadius, -0.5 * Math.PI, 0.5 * Math.PI);
                cr.fill();
              }
              else {
                cr.rectangle(wsCenterX, wsCenterY - workspaceRadius, workspaceRadius, workspaceRadius * 2);
                cr.fill();
              }
            }
          }

          // Draw active ws
          cr.setSourceRGBA(activebg.red, activebg.green, activebg.blue, activebg.alpha);
          cr.arc(activeWsCenterX, activeWsCenterY, indicatorRadius, 0, 2 * Math.PI);
          cr.fill();

          // Draw workspace numbers
          for (let i = 1; i <= count; i++) {
            const inactivecolors = workspaceInfo.mask & (1 << i) ? occupiedfg : wsfg;
            if (i == activeWs) {
              cr.setSourceRGBA(activefg.red, activefg.green, activefg.blue, activefg.alpha);
            }
            // Moving to
            else if ((i == Math.floor(activeWs) && workspaceInfo.mask < activeWs) || (i == Math.ceil(activeWs) && activeWorspace.id > activeWs)) {
              cr.setSourceRGBA(mix(activefg.red, inactivecolors.red, 1 - Math.abs(activeWs - i)), mix(activefg.green, inactivecolors.green, 1 - Math.abs(activeWs - i)), mix(activefg.blue, inactivecolors.blue, 1 - Math.abs(activeWs - i)), activefg.alpha);
            }
            // Moving from
            else if ((i == Math.floor(activeWs) && activeWorspace.id > activeWs) || (i == Math.ceil(activeWs) && activeWorspace.id < activeWs)) {
              cr.setSourceRGBA(mix(activefg.red, inactivecolors.red, 1 - Math.abs(activeWs - i)), mix(activefg.green, inactivecolors.green, 1 - Math.abs(activeWs - i)), mix(activefg.blue, inactivecolors.blue, 1 - Math.abs(activeWs - i)), activefg.alpha);
            }
            // Inactive
            else
              cr.setSourceRGBA(inactivecolors.red, inactivecolors.green, inactivecolors.blue, inactivecolors.alpha);

            layout.set_text((i + offset).toString(), -1);
            const [layoutWidth, layoutHeight] = layout.get_pixel_size();
            const x = -workspaceRadius + (workspaceDiameter * i) - (layoutWidth / 2);
            const y = (height - layoutHeight) / 2;
            cr.moveTo(x, y);
            PangoCairo.show_layout(cr, layout);
            cr.stroke();
          }
        })}
    >
    </drawingarea>
  );
};

export const Workspace = () => {
  const count = configOptions.workspaces.shown;
  return (
    <eventbox
      setup={(self) => {
        self.add_events(Gdk.EventMask.BUTTON_PRESS_MASK);
        self.hook(self, "button-press-event", (self, event: Gdk.Event) => {
          if (event.get_button()[1] === 1) {
            const [_, x, _y] = event.get_coords();
            const widgetWidth = self.get_allocation().width;
            const wsId = Math.ceil(x * count / widgetWidth);
            execAsync([`${GLib.get_user_config_dir()}/hypr/scripts/workspaceAction.sh`, "workspace", wsId.toString()]).catch(print);
          }
          else if (event.get_button()[1] === 8) {
            // Hyprland.messageAsync(`dispatch togglespecialworkspace`).catch(print);
          }
        });
      }}
    >
      <box
        homogeneous={true}
        className="bar-group-margin"
      >
        <box
          className="bar-group bar-group-standalone bar-group-pad"
          css="min-width: 2px"

        >
          <WorkspaceContents />
        </box>
      </box>
    </eventbox>
  );
};
