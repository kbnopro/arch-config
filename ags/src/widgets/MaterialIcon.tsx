import type { Widget } from "astal/gtk3";

interface MaterialIconProps extends Omit<Widget.LabelProps, "className"> {
  size: string;
}

/*
 * Widget to quickly use Material Icon
 * @params {string} label - The Material Icon name. */
export const MaterialIcon = ({ size, ...props }: MaterialIconProps) => (
  <label className={`icon-material txt-${size}`} {...props} />
);
