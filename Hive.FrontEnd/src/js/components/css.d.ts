import * as React from 'react';

declare module 'react' {
  interface CSSProperties {
    // Add a CSS Custom Property
    '--color'?: string;
  }
}