/* eslint-disable no-unused-vars */
// noinspection ES6UnusedImports
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from 'react';

declare module 'react' {
    interface CSSProperties {
        '--color'?: string;
        '--hex-offset'?: number;
        '--hex-size'?: string;
    }
}
