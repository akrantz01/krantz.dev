interface BaseItem {
  icon: string;
  text: string;
}

interface ActionItem extends BaseItem {
  type: 'action';
  onClick?: () => void;
}

interface DividerItem extends BaseItem {
  type: 'divider';
}

interface LinkItem extends BaseItem {
  type: 'link';
  external?: boolean;
  href?: string;
}

export type NavigationItem = ActionItem | DividerItem | LinkItem;
