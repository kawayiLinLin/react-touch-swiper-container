declare type Noop = (...args: any[]) => any;
declare function usePersistFn<T extends Noop>(fn: T): T;
interface Pages<Key extends string | number> extends Array<{
    [key in Key]: number;
}> {
}
declare function useTouchSwiperPage<Key extends string | number, PagesType extends Pages<Key>>(pages: PagesType, key?: Key): {
    pages: ({ [key in Key]: number; }[NonNullable<Key>] | null)[];
    getPage: (id: number | null) => PagesType[number] | undefined;
    handleAnimationEndChange: (next: number) => void;
};
export { usePersistFn, useTouchSwiperPage };
declare const _default: {
    usePersistFn: typeof usePersistFn;
    useTouchSwiperPage: typeof useTouchSwiperPage;
};
export default _default;
