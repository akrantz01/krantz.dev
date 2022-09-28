import {
  faArrowUpRightFromSquare,
  faBriefcase,
  faCakeCandles,
  faGraduationCap,
  faRocket,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetStaticProps } from 'next';

import Button from '@/components/Button';
import Layout from '@/components/Layout';
import Pill from '@/components/Pill';
import { loadTimeline } from '@/lib';
import { Timeline } from '@/types';

const ICONS = {
  celebration: faCakeCandles,
  career: faBriefcase,
  launch: faRocket,
  school: faGraduationCap,
};

interface Props {
  timeline: Timeline;
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const timeline = await loadTimeline();
  return { props: { timeline } };
};

const Timeline = ({ timeline }: Props): JSX.Element => (
  <Layout seo={{ title: 'Alex Krantz - Timeline' }}>
    <div className="flex flex-grow min-h-screen pt-16 pb-12">
      <div className="flex-grow flex flex-col justify-center max-w-sm sm:max-w-4xl w-full mx-auto px-0 sm:px-16">
        <ul className="-mb-8" role="list">
          {timeline.map((event, index) => (
            <li className="my-1" key={index}>
              <div className="relative pb-8">
                {index !== timeline.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute top-1 left-1/2 w-0.5 h-full -ml-px bg-gray-200 dark:bg-gray-600"
                  />
                )}
                <div className="relative flex items-center space-x-3 bg-gray-50 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 backdrop-filter backdrop-blur-sm px-2 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="relative flex items-center justify-center w-12 h-12 bg-primary-500 bg-opacity-15 backdrop-filter backdrop-blur-sm saturate-200 mx-2 px-1 rounded-full">
                    <FontAwesomeIcon aria-hidden="true" className="w-6 h-6 text-primary-500" icon={ICONS[event.type]} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h1 className="flex flex-wrap justify-between mb-2 text-gray-500 dark:text-white text-lg tracking-tight font-bold">
                      <span>{event.title}</span>
                      <span className="flex-1 sm:hidden" />
                      <Pill className="mt-2 sm:mt-0" small>
                        {event.date}
                      </Pill>
                    </h1>

                    <p className="my-2 text-gray-400 dark:text-gray-300 text-base">{event.description}</p>

                    {event.link && (
                      <Button className="mt-2" href={event.link.href} small outline>
                        {event.link.text}
                        <FontAwesomeIcon aria-hidden="true" className="ml-3 h-4 w-4" icon={faArrowUpRightFromSquare} />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </Layout>
);

export default Timeline;
