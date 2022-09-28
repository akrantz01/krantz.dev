import { IconDefinition } from '@fortawesome/free-brands-svg-icons';

interface BaseItem {
  icon: IconDefinition;
  text: string;
}

interface ActionItem extends BaseItem {
  type: 'action';
  onClick?: () => void;
  endIcon?: IconDefinition;
}

interface DividerItem {
  type: 'divider';
}

interface LinkItem extends BaseItem {
  type: 'link';
  external?: boolean;
  href: string;
}

export type NavigationItem = ActionItem | DividerItem | LinkItem;
