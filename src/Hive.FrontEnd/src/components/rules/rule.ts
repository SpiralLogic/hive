import { FunctionComponent } from 'preact';

export type Rule = {
  title: string;
  description: Array<string>;
  displayName: string;
} & FunctionComponent;
