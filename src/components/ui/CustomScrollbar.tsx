'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from './CustomScrollbar.module.css';

const CustomScrollbar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisibleState, setIsVisibleState] = useState(false);

  const handleScroll = useCallback(() => {
    const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (totalHeight <= 0) {
      setScrollProgress(0);
      setIsVisibleState(false);
      return;
    }
    setIsVisibleState(true);

    const currentScroll = window.scrollY;
    const progress = (currentScroll / totalHeight) * 100;
    setScrollProgress(progress);
  }, []);

  useEffect(() => {
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  const minThumbHeightPercentage = 8;
  const contentHeight = typeof document !== 'undefined' ? document.documentElement.scrollHeight : 0;
  const viewportHeight = typeof document !== 'undefined' ? document.documentElement.clientHeight : 0;

  let thumbHeightPercentage = (viewportHeight / contentHeight) * 100;
  thumbHeightPercentage = Math.max(thumbHeightPercentage, minThumbHeightPercentage);
  thumbHeightPercentage = Math.min(thumbHeightPercentage, 100);

  const thumbPosition = (scrollProgress / 100) * (100 - thumbHeightPercentage);

  const shouldRender = isVisibleState;

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={`
        ${styles.customScrollbarNotch}
        ${isVisibleState ? styles.visible : ''} 
      `}
    >
      <div
        className={styles.customScrollbarThumb}
        style={{
          height: `${thumbHeightPercentage}%`,
          top: `${thumbPosition}%`,
        }}
      />
    </div>
  );
};

export default CustomScrollbar;
