export type Timeline = TimelineEvent[];

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  icon: string;
  link?: TimelineLink;
}

interface TimelineLink {
  text: string;
  href: string;
}
