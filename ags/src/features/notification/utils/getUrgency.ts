import Notifd from "gi://AstalNotifd";

export const getUrgency = (notifObject: Notifd.Notification) => {
  const urgency = notifObject.get_urgency();
  const { LOW, NORMAL, CRITICAL } = Notifd.Urgency;
  switch (urgency) {
    case LOW:
      return "low";
    case CRITICAL:
      return "critical";
    case NORMAL:
    default:
      return "normal";
  }
};
