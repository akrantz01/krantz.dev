import { useEffect, useState } from 'react';

import Animate from '@/components/Animate';
import Pill from '@/components/Pill';

const DESCRIPTORS = ['developer', 'hiker', 'photographer', 'biker', 'backpacker'];

const Descriptor = (): JSX.Element => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i === DESCRIPTORS.length - 1 ? 0 : i + 1)), 2500);

    return () => clearInterval(id);
  }, []);

  return (
    <Pill className="mt-4">
      <Animate animation={{ scale: [0.9, 1], opacity: [0.5, 1] }}>{DESCRIPTORS[index]}</Animate>
    </Pill>
  );
};

export default Descriptor;
