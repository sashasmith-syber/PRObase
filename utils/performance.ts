import { onCLS, onFCP, onINP, onLCP, onTTFB, Metric } from 'web-vitals';

const isDev = import.meta.env.DEV;

const logMetric = (metric: Metric): void => {
  if (!isDev) return;
  console.info(`[WebVitals] ${metric.name}`, metric.value);
};

/**
 * @returns void
 */
export const initPerformanceMonitoring = (): void => {
  onCLS(logMetric);
  onFCP(logMetric);
  onINP(logMetric);
  onLCP(logMetric);
  onTTFB(logMetric);
};

/**
 * @param durationMs - Request duration in milliseconds.
 * @param success - Whether the request succeeded.
 * @returns void
 */
export const recordApiTiming = (durationMs: number, success: boolean): void => {
  if (!isDev) return;
  console.info('[API Timing]', { durationMs, success });
};

/**
 * @param message - Error message or label.
 * @returns void
 */
export const recordErrorMetric = (message: string): void => {
  if (!isDev) return;
  console.warn('[Error]', message);
};
