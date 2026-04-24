export interface NavItem {
  path: string;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { path: 'home', label: 'Home' },
  { path: 'basic-grid', label: 'Basic Grid' },
  { path: 'intro-to-aggrid', label: 'Intro to AG Grid' },
  { path: 'column-definitions', label: 'Column Definitions' },
];
