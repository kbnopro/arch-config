import { App } from "astal/gtk3";
import { exec } from "astal/process";
import GLib from "gi://GLib?version=2.0";
export const COMPILED_STYLE_DIR = `${GLib.get_user_cache_dir()}/ags/user/generated`;
import configOptions from "@config";
import { writeFile } from "astal/file";
import { exit } from "system";

const resetStyle = () => {
  // TODO: dynamically retrieve darkmode and support changing darkmode-lightmode
  const lightdark = "dark";
  writeFile(`${GLib.get_user_state_dir()}/ags/scss/_lib_mixins_overrides.scss`, `@mixin symbolic-icon {
    -gtk-icon-theme: '${configOptions.icons.symbolicIconTheme[lightdark]}';
}
`);
  try {
    exec(`sass 
      -I "${GLib.get_user_state_dir()}/ags/scss" -I "${GLib.get_user_config_dir()}/ags/src/scss/fallback" 
      "${GLib.get_user_config_dir()}/ags/src/scss/main.scss"
      "${COMPILED_STYLE_DIR}/style.css"
    `);
  }
  catch (err) {
    console.error(err);
    exit(1);
  }
};

export const applyStyle = () => {
  resetStyle();
  App.reset_css();
  App.apply_css(`${COMPILED_STYLE_DIR}/style.css`);
};
