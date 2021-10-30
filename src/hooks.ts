import { useEffect, useMemo, useRef, useState } from "react";

type Noop = (...args: any[]) => any;

type GetThis<T> = T extends (this: infer This, ...args: any[]) => any
  ? This
  : never;

function usePersistFn<T extends Noop>(fn: T) {
  const fnRef = useRef<T>(fn);
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const persistFn = useRef<T>();
  if (!persistFn.current) {
    persistFn.current = function(this: GetThis<T>, ...args) {
      return fnRef.current.apply(this, args);
    } as T;
  }

  return persistFn.current;
}

interface Pages<Key extends string | number>
  extends Array<{ [key in Key]: number }> {}

function useTouchSwiperPage<
  Key extends string | number,
  PagesType extends Pages<Key>
>(pages: PagesType, key?: Key) {
  key = key ?? ("id" as Key);
  const [current, setCurrent] = useState<number>(0);

  const [pageCache] = useState(() => new Map());
  const pageCacheRef = useRef<Map<number, PagesType[number]>>(pageCache);

  const handleChange = usePersistFn((next: number) => {
    setCurrent(next);
  });

  const hooksResult = useMemo(() => {
    const currentIndex = pages.findIndex((p) => p[key!] === current);

    const renderedPage = [
      pages[currentIndex - 1],
      pages[currentIndex],
      pages[currentIndex + 1],
    ].map((item) => {
      if (item) pageCacheRef.current.set(item[key!], item);
      
      return !item ? null : item[key!];
    });

    const getPage = (id: number | null) => {
      return pageCacheRef.current.get(id!);
    };

    return {
      pages: renderedPage,
      getPage,
      handleAnimationEndChange: handleChange,
    };
  }, [handleChange, pages, key, current]);

  return hooksResult;
}

export { usePersistFn, useTouchSwiperPage };

export default {
  usePersistFn,
  useTouchSwiperPage,
};
