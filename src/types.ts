import { ComponentType } from "react";

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface AppWindow {
  id: string;
  title: string;
  component: ComponentType<any>;
}

export interface AppDefinition {
  id: string;
  title: string;
  icon: string;
  component: ComponentType<any>;
}
