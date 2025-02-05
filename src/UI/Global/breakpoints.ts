export const breakpoints = {
  xSmall: 340,
  phone: 480,
  small: 620,
  tablet: 780,
  medium: 860,
  large: 1000,
  xLarge: 1200,
  xxLarge: 1400,
};

export interface BreakpointOptions {
  min?:
    | "xSmall"
    | "phone"
    | "small"
    | "tablet"
    | "medium"
    | "large"
    | "xLarge"
    | "xxLarge";
  max?:
    | "xSmall"
    | "phone"
    | "small"
    | "tablet"
    | "medium"
    | "large"
    | "xLarge"
    | "xxLarge";
}

export const getBreakpoint = ({ min, max }: BreakpointOptions) => {
  const minBp =
    min && breakpoints[min] ? `and (min-width: ${breakpoints[min] + 1}px)` : "";
  const maxBp =
    max && breakpoints[max] ? `and (max-width: ${breakpoints[max]}px)` : "";
  return `@media only screen ${minBp} ${maxBp}`;
};
