import configOptions from "@config";
import { execAsync } from "astal";
import AstalBattery from "gi://AstalBattery?version=0.1";

const battery = AstalBattery.get_default();

let warned = false;

const checkBattery = () => {
  const batteryPercentage = battery.percentage * 100;
  const batteryCharging = battery.charging;
  if (batteryCharging) {
    warned = false;
    return;
  }
  for (let i = configOptions.battery.warnLevels.length; i >= 0; i--) {
    if (!warned && batteryPercentage <= configOptions.battery.warnLevels[i]) {
      warned = true;
      execAsync(["bash", "-c", `notify-send "${configOptions.battery.warnTitles[i]}" "${configOptions.battery.warnMessages[i]}" -u critical -a AGS -t 69420 &`]).catch(print);
      break;
    }
  }
  if (batteryPercentage < configOptions.battery.suspendThreshold) {
    execAsync(["bash", "-c",
      `notify-send "Suspending system" "Critical battery level (${batteryPercentage.toFixed(0)}% remaining)" -u critical -a AGS -t 69420 &`,
    ]).catch(print);
    execAsync("systemctl suspend").catch(print);
  }
};

export const startBatteryWarningService = () => {
  battery.connect("notify::percentage", checkBattery);
  battery.connect("notify::charging", () => {
    if (!battery.charging) {
      checkBattery();
    }
  });
};
