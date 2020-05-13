// noinspection ES6UnusedImports
import * as React from 'react';

declare module 'react' {
    interface CSSProperties {
        '--color'?: string;
        '--hex-offset'?: number;
        '--hex-size'?: string;
    }
}