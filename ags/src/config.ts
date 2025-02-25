const configOptions = {
  time: {
    // See https://docs.gtk.org/glib/method.DateTime.format.html
    format: "%H:%M",
    interval: 5000,
    dateFormat: "%d/%m",
    dateFormatLong: "%A, %d/%m",
    dateInterval: 5000,
  },
  animations: {
    durationSmall: 110,
    durationLarge: 180,
  },
  bar: {
    modes: ["normal", "focus", "nothing"] as const,
  },
  icons: {
    symbolicIconTheme: {
      dark: "Adwaita",
      light: "Adwaita",
    },
  },
  workspaces: {
    shown: 10,
  },
  battery: {
    low: 20,
    critical: 10,
    warnLevels: [20, 15, 5],
    warnTitles: ["Low battery", "Very low battery", "Critical Battery"],
    warnMessages: ["Plug in the charger", "You there?", "PLUG THE CHARGER ALREADY"],
    suspendThreshold: 3,
  },
};

export default configOptions;
