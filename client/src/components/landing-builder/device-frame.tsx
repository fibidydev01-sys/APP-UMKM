/**
 * DeviceFrame Component
 *
 * Wraps the preview with device mockups (Laptop, Tablet, Mobile)
 */

'use client';

import { cn } from '@/lib/utils';

export type DeviceMode = 'normal' | 'laptop' | 'tablet' | 'mobile';

interface DeviceFrameProps {
  mode: DeviceMode;
  children: React.ReactNode;
  className?: string;
}

export function DeviceFrame({ mode, children, className }: DeviceFrameProps) {
  if (mode === 'normal') {
    return (
      <div className={cn('w-full h-full', className)}>
        {children}
      </div>
    );
  }

  // Device-specific styles
  const deviceStyles = {
    laptop: {
      container: 'max-w-6xl mx-auto p-8',
      screen: 'relative rounded-t-xl border-8 border-gray-800 bg-gray-800 shadow-2xl overflow-hidden',
      content: 'bg-white dark:bg-gray-900 aspect-[16/10]',
      base: 'h-4 bg-gray-800 rounded-b-xl border-4 border-t-0 border-gray-700',
      stand: 'w-32 h-2 mx-auto bg-gray-700 rounded-b-lg',
    },
    tablet: {
      container: 'max-w-3xl mx-auto p-8',
      screen: 'relative rounded-2xl border-[14px] border-gray-800 bg-gray-800 shadow-2xl overflow-hidden',
      content: 'bg-white dark:bg-gray-900 aspect-[3/4]',
    },
    mobile: {
      container: 'max-w-sm mx-auto p-8',
      screen: 'relative rounded-[2.5rem] border-[14px] border-gray-900 bg-gray-900 shadow-2xl overflow-hidden',
      content: 'bg-white dark:bg-gray-900 aspect-[9/19.5]',
      notch: 'absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-10',
    },
  };

  const styles = deviceStyles[mode];

  return (
    <div className={cn('w-full h-full flex items-center justify-center overflow-auto', className)}>
      <div className={styles.container}>
        <div className={styles.screen}>
          {mode === 'mobile' && <div className={styles.notch} />}
          <div className={styles.content}>
            <div className="w-full h-full overflow-auto">
              {children}
            </div>
          </div>
        </div>
        {mode === 'laptop' && (
          <div>
            <div className={styles.base} />
            <div className={styles.stand} />
          </div>
        )}
      </div>
    </div>
  );
}
