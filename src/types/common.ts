import type { IconName } from "./icon";

export type WidgetType = "profile" | "small" | "medium" | "large";

export interface Widget {
  title?: string;
  children: React.ReactNode;
  type?: WidgetType;
}

export interface Row {
  children: React.ReactNode;
}

export type CardType = "image" | "info" | "item" | "gallery" | "profile";

export interface Card {
  title?: string;
  type?: CardType;
  onClick?: () => void;
  image?: string;
  icon?: IconName;
  children?: React.ReactNode;
  footer?: string;
  href?: string;
  collectionName?: string; // Firestore-samlingen som hentes når type="gallery"
  maxImages?: number; // Maks antall bilder som hentes når type="gallery"
}

export type ButtonType =
  | "icon"
  | "list"
  | "navbar"
  | "nav"
  | "trail"
  | "outline";

export interface Button {
  icon?: string;
  iconImage?: string; // Bruk denne i stedet for icon for merkevarelogoer (GitHub, LinkedIn) som ikke finnes i ikon-biblioteket
  iconSize?: number;
  label?: string;
  onClick?: () => void;
  type?: ButtonType;
  href?: string;
  active?: boolean;
}

export type ButtonGroupType = "menu" | "navigation";

export interface ButtonGroup {
  type: ButtonGroupType;
  children: React.ReactNode;
}

export interface Image {
  src: string;
  alt: string;
  description?: string;
}

export type GridType = "col-2" | "col-3" | "col-4" | "timeline-col";

export interface Grid {
  children: React.ReactNode;
  type: GridType;
}

export type TimelineType = "vertical" | "horizontal";

export interface TimelineEntry {
  label: string;
  title: string;
  description?: string;
  footer?: string;
}

export interface Timeline {
  items: TimelineEntry[];
  type: TimelineType;
}
