/* eslint-disable no-unused-vars */
// noinspection ES6UnusedImports
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'preact/compat';

declare module 'preact/compat' {
    interface CSSProperties {
        '--color'?: string;
        '--hex-offset'?: number;
        '--hex-size'?: string;
    }
}
