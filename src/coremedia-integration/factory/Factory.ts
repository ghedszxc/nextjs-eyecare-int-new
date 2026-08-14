export abstract class Factory<TComparator, TInstance> {
  abstract instance: (comparator: TComparator) => TInstance;
}
