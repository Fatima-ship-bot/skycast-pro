import { memo, useMemo, useCallback } from "react";

// Memoized version of expensive components
export const memoizeComponent = <P extends object>(
  Component: React.ComponentType<P>,
  propsAreEqual?: (prevProps: P, nextProps: P) => boolean
) => {
  return memo(Component, propsAreEqual);
};

// Hook for expensive calculations
export const useMemoValue = <T,>(factory: () => T, deps: React.DependencyList) => {
  return useMemo(factory, deps);
};

// Hook for memoizing callbacks
export const useMemoCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
) => {
  return useCallback(callback, deps) as T;
};

// Optimize deep object comparison
export const shallowEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true;
  if (!obj1 || !obj2) return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  return keys1.every((key) => obj1[key] === obj2[key]);
};
