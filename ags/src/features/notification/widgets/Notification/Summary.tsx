import { getTimeString, type NotifData } from "@notification";
import { timeout } from "astal";
import { Gtk } from "astal/gtk3";

import { ExpandButton } from "./ExpandButton";

const SummaryText = ({
  notifData: { notifObject },
}: {
  notifData: NotifData;
}) => {
  const summary = notifObject.get_summary();
  return (
    <label
      xalign={0}
      hexpand={true}
      className="txt-small txt-semibold titlefont"
      justify={Gtk.Justification.LEFT}
      truncate={true}
      ellipsize={3}
      useMarkup={summary.startsWith("<")}
      label={summary}
    />
  );
};

const SummaryTime = ({
  notifData: { notifObject },
}: {
  notifData: NotifData;
}) => {
  const time = notifObject.get_time();
  const timeString = getTimeString(time);
  return (
    <label
      justify={Gtk.Justification.RIGHT}
      className="txt-smaller txt-semibold"
      label={timeString}
      setup={(self) => {
        if (timeString == "Now") {
          const updateTimeout = timeout(60000, () => {
            self.label = getTimeString(time);
          });
          self.connect("destroy", () => {
            updateTimeout.cancel();
          });
        }
      }}
    />
  );
};

export const Summary = ({ notifData }: { notifData: NotifData }) => {
  return (
    <box vertical={false}>
      <SummaryText notifData={notifData} />
      <box className="spacing-h-5">
        <SummaryTime notifData={notifData} />
        <ExpandButton notifData={notifData} />
      </box>
    </box>
  );
};
