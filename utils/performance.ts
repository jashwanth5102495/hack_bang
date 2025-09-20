/**
 * Performance Monitoring Utility
 * Tracks app performance metrics and provides optimization insights
 */

import React from 'react';

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private memoryUsage: number[] = [];
  private renderTimes: number[] = [];

  // Start timing a performance metric
  startTiming(name: string, metadata?: Record<string, any>): void {
    this.metrics.set(name, {
      name,
      startTime: performance.now(),
      metadata
    });
  }

  // End timing and calculate duration
  endTiming(name: string): number | null {
    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`Performance metric "${name}" not found`);
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - metric.startTime;

    metric.endTime = endTime;
    metric.duration = duration;

    // Log slow operations (>100ms)
    if (duration > 100) {
      console.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  // Track component render time
  trackRender(componentName: string, renderTime: number): void {
    this.renderTimes.push(renderTime);
    
    // Keep only last 50 render times
    if (this.renderTimes.length > 50) {
      this.renderTimes.shift();
    }

    // Log slow renders (>16ms for 60fps)
    if (renderTime > 16) {
      console.warn(`Slow render: ${componentName} took ${renderTime.toFixed(2)}ms`);
    }
  }

  // Track memory usage
  trackMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usedMB = memory.usedJSHeapSize / 1024 / 1024;
      
      this.memoryUsage.push(usedMB);
      
      // Keep only last 100 measurements
      if (this.memoryUsage.length > 100) {
        this.memoryUsage.shift();
      }

      // Warn if memory usage is high (>50MB)
      if (usedMB > 50) {
        console.warn(`High memory usage: ${usedMB.toFixed(2)}MB`);
      }
    }
  }

  // Get performance summary
  getSummary(): {
    averageRenderTime: number;
    slowRenders: number;
    currentMemoryUsage: number;
    peakMemoryUsage: number;
    completedMetrics: PerformanceMetric[];
  } {
    const averageRenderTime = this.renderTimes.length > 0 
      ? this.renderTimes.reduce((a, b) => a + b, 0) / this.renderTimes.length 
      : 0;

    const slowRenders = this.renderTimes.filter(time => time > 16).length;

    const currentMemoryUsage = this.memoryUsage.length > 0 
      ? this.memoryUsage[this.memoryUsage.length - 1] 
      : 0;

    const peakMemoryUsage = this.memoryUsage.length > 0 
      ? Math.max(...this.memoryUsage) 
      : 0;

    const completedMetrics = Array.from(this.metrics.values())
      .filter(metric => metric.duration !== undefined);

    return {
      averageRenderTime,
      slowRenders,
      currentMemoryUsage,
      peakMemoryUsage,
      completedMetrics
    };
  }

  // Clear all metrics
  clear(): void {
    this.metrics.clear();
    this.memoryUsage.length = 0;
    this.renderTimes.length = 0;
  }

  // Log performance report
  logReport(): void {
    const summary = this.getSummary();
    
    console.group('🚀 Performance Report');
    console.log(`Average Render Time: ${summary.averageRenderTime.toFixed(2)}ms`);
    console.log(`Slow Renders: ${summary.slowRenders}`);
    console.log(`Current Memory: ${summary.currentMemoryUsage.toFixed(2)}MB`);
    console.log(`Peak Memory: ${summary.peakMemoryUsage.toFixed(2)}MB`);
    console.log(`Completed Operations: ${summary.completedMetrics.length}`);
    
    if (summary.completedMetrics.length > 0) {
      console.group('Slowest Operations:');
      summary.completedMetrics
        .sort((a, b) => (b.duration || 0) - (a.duration || 0))
        .slice(0, 5)
        .forEach(metric => {
          console.log(`${metric.name}: ${metric.duration?.toFixed(2)}ms`);
        });
      console.groupEnd();
    }
    
    console.groupEnd();
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export const usePerformanceMonitor = () => {
  const startTiming = (name: string, metadata?: Record<string, any>) => {
    performanceMonitor.startTiming(name, metadata);
  };

  const endTiming = (name: string) => {
    return performanceMonitor.endTiming(name);
  };

  const trackRender = (componentName: string, renderTime: number) => {
    performanceMonitor.trackRender(componentName, renderTime);
  };

  return {
    startTiming,
    endTiming,
    trackRender,
    getSummary: () => performanceMonitor.getSummary(),
    logReport: () => performanceMonitor.logReport()
  };
};

// Higher-order component for automatic performance tracking
export const withPerformanceTracking = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) => {
  return React.forwardRef<any, P>((props, ref) => {
    const renderStart = performance.now();
    
    React.useEffect(() => {
      const renderEnd = performance.now();
      performanceMonitor.trackRender(componentName, renderEnd - renderStart);
    });

    return <WrappedComponent {...props} ref={ref} />;
  });
};

// Utility functions
export const measureAsync = async <T>(
  name: string,
  asyncFunction: () => Promise<T>
): Promise<T> => {
  performanceMonitor.startTiming(name);
  try {
    const result = await asyncFunction();
    performanceMonitor.endTiming(name);
    return result;
  } catch (error) {
    performanceMonitor.endTiming(name);
    throw error;
  }
};

export const measureSync = <T>(
  name: string,
  syncFunction: () => T
): T => {
  performanceMonitor.startTiming(name);
  try {
    const result = syncFunction();
    performanceMonitor.endTiming(name);
    return result;
  } catch (error) {
    performanceMonitor.endTiming(name);
    throw error;
  }
};