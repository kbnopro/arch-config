import { Astal, Widget } from "astal/gtk3";

interface MaterialIconProps
  extends Omit<Widget.LabelProps, "className" | "label"> {
  icon: string;
  size: string;
}

export const MaterialIcon = ({ icon, size, ...props }: MaterialIconProps) => (
  <label className={`icon-material txt-${size}`} label={icon} {...props} />
);
