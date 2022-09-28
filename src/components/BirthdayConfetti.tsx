import { create as createConfetti } from 'canvas-confetti';
import type { Options } from 'canvas-confetti';
import { useEffect, useRef } from 'react';

const defaultOptions: Options = { particleCount: 100, startVelocity: 100, spread: 70 };

const BirthdayConfetti = (): JSX.Element => {
  const ref = useRef<HTMLCanvasElement | null>(null);

  const confetti = createConfetti(ref.current || undefined, { resize: true });
  useEffect(() => {
    const timeout = setTimeout(
      () =>
        Promise.all([
          confetti({ ...defaultOptions, angle: 60, origin: { x: 0, y: 1 } }),
          confetti({ ...defaultOptions, angle: 120, origin: { x: 1, y: 1 } }),
        ]),
      1000,
    );

    return () => clearTimeout(timeout);
  }, [confetti]);

  return <canvas className="fixed inset-0 z-20" ref={ref} />;
};

export default BirthdayConfetti;
