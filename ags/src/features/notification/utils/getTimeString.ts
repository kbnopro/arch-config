import configOptions from "@config";
import GLib from "gi://GLib?version=2.0";

export const getTimeString = (time: number) => {
  const sendTime = GLib.DateTime.new_from_unix_local(time);
  const now = GLib.DateTime.new_now_local();
  const oneMinuteAgo = now.add_seconds(-60);
  const today = now.get_day_of_year();
  if (!oneMinuteAgo) return "Error calculating time";
  if (sendTime.compare(oneMinuteAgo) > 0) return "Now";
  if (sendTime.get_day_of_year() == today)
    return sendTime.format(configOptions.time.format) ?? "Error in time format";
  if (sendTime.get_day_of_year() == today - 1) return "Yesterday";
  return (
    sendTime.format(configOptions.time.dateFormat) ?? "Error in time format"
  );
};
