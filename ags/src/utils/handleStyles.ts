import { App } from "astal/gtk3";
import { exec } from "astal/process";
import GLib from "gi://GLib?version=2.0";
export const COMPILED_STYLE_DIR = `${GLib.get_user_cache_dir()}/ags/user/generated`;

const resetStyle = () => {
  exec(`sass 
    -I "${GLib.get_user_state_dir()}/ags/scss" 
    -I "${GLib.get_user_config_dir()}/ags/src/scss/fallback" 
    "${GLib.get_user_config_dir()}/ags/src/scss/main.scss"
    "${COMPILED_STYLE_DIR}/style.css"
  `);
};

export const applyStyle = () => {
  resetStyle();
  App.reset_css();
  App.apply_css(`${COMPILED_STYLE_DIR}/style.css`);
};
