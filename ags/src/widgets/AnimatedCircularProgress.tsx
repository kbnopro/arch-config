import { interval } from "astal";
import type { Widget } from "astal/gtk3";

export const AnimatedCircularProgress = ({ timeout, ...props }:
  { timeout: number } & Partial<Widget.CircularProgressProps>) => {
  const intervalSplit = 100;
  const progress = interval(timeout / 100);
  return (
    <circularprogress
      {...props}
      value={0}
      setup={self => self.hook(progress, "now", () => {
        self.set_value(self.value + 1 / intervalSplit);
      })}
    />
  );
};
