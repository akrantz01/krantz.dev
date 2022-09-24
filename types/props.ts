import { ComponentProps, JSXElementConstructor } from 'react';

/**
 * Extracts the prop types from the typeof of a component
 */
export type WithProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<U>, U = any> = ComponentProps<T>;
