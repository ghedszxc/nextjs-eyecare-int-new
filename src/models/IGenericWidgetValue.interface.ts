import { Nullable } from "./Nullable.interface";

export type GenericWidgetValueModel = Nullable<unknown>;
export type GenericWidgetNameModel = string;
export type GenericWidgetIdModel = string;

export type WidgetProps<T> = {
  data: T;
  animation?: string;
};
