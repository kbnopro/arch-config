import type { Variable } from "astal";
import type Notifd from "gi://AstalNotifd";

export interface NotifData {
  notifObject: Notifd.Notification;
  expanded: Variable<boolean>;
  isPopup: boolean;
}
