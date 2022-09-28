import { formatDate } from '@/lib';
import { Timeline } from '@/types';

/**
 * Load the timeline from the content folder
 */
export const loadTimeline = async (): Promise<Timeline> => {
  const file = await import('@/content/timeline.json');
  const timeline = file.default.map((event) => ({ ...event, date: new Date(event.date + 'T00:00') }));

  timeline.sort((a, b) => b.date.getTime() - a.date.getTime());

  return timeline.map((event) => ({
    ...event,
    date: formatDate(event.date),
  }));
};
