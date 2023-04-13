import { Reporter, Vitest } from 'vitest';

declare class HTMLReporter implements Reporter {
    start: number;
    ctx: Vitest;
    reportUIPath: string;
    onInit(ctx: Vitest): Promise<void>;
    onFinished(): Promise<void>;
    writeReport(report: string): Promise<void>;
}

export { HTMLReporter as default };
