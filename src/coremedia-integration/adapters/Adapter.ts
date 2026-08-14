import { Nullable } from "../../models/Nullable.interface";

export interface IAdapter {
  adapt: (source: any) => any;
  adaptReverse: (source: any) => any;
}
export abstract class Adapter<TSource, TTarget> implements IAdapter {
  abstract adapt: (source: TSource) => TTarget;
  abstract adaptReverse: (source: TTarget) => TSource;
  adaptList: (source: TSource[]) => Nullable<TTarget[]> = (
    source: TSource[]
  ) => {
    return source ? source.map(this.adapt) : null;
  };
  adaptListReverse: (source: TTarget[]) => Nullable<TSource[]> = (
    source: TTarget[]
  ) => {
    return source ? source.map(this.adaptReverse) : null;
  };
}
