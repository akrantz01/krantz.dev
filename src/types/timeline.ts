export type Timeline = TimelineEvent[];

export type TimelineEventType = 'celebration' | 'school' | 'career' | 'launch';

export interface TimelineEvent {
  type: TimelineEventType;
  date: string;
  title: string;
  description: string;
  link?: TimelineLink;
}

interface TimelineLink {
  text: string;
  href: string;
}
