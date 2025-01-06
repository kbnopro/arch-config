import { getUrgency, type NotifData } from "@notification";

export const getTimeout = (notifData: NotifData) => {
  const { notifObject } = notifData;
  const notifTimeOut = notifObject.get_expire_timeout();
  if (notifTimeOut == -1) {
    // This is the case when timeout is not set by application
    return getUrgency(notifObject) == "critical" ? 8000 : 3000;
  }
  return notifTimeOut;
};
