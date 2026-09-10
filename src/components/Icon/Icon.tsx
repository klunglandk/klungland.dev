import { IconObject, type Icon } from "../../types/icon";

// Props: size (default 24)
// color (default currentColor)
// strokeWidth (default 2)
// nonScalingStroke (default false)

export default function Icon({ icon, size }: Icon) {
  const IconComponent = IconObject[icon];
  return <IconComponent size={size} color="currentColor" />;
}
