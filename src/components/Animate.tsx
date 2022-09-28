import { isCrawlerUserAgent } from 'is-web-crawler';
import { animate, spring } from 'motion';
import type { AnimationOptionsWithOverrides, MotionKeyframesDefinition } from 'motion';
import { useEffect, useRef } from 'react';
import type { ComponentPropsWithRef, ElementType } from 'react';
import { useMedia } from 'react-use';

type Props<T extends ElementType> = Omit<ComponentPropsWithRef<T>, 'animation' | 'as' | 'transition'> & {
  animation: MotionKeyframesDefinition;
  as?: T;
  enabled?: boolean;
  transition?: AnimationOptionsWithOverrides;
};

const defaultTransition: AnimationOptionsWithOverrides = {
  delay: 0,
  duration: 1500,
  easing: spring(),
  repeat: 0,
};

const Animate = <T extends ElementType>({
  animation,
  as: Component = 'div' as T,
  children,
  enabled = true,
  transition,
  ...rest
}: Props<T>): JSX.Element => {
  const prefersReducedMotion = useMedia('(prefers-reduced-motion)', true);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (ref.current && enabled && !(prefersReducedMotion || isCrawlerUserAgent())) {
      animate(ref.current, animation, { ...defaultTransition, ...transition });
    }
  }, [animation, enabled, prefersReducedMotion, transition]);

  return (
    // @ts-expect-error
    <Component ref={ref} {...rest}>
      {children}
    </Component>
  );
};

export default Animate;
