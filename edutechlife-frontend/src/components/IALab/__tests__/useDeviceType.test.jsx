import { describe, it, expect, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDeviceType } from '../../../hooks/useDeviceType';

describe('useDeviceType', () => {
  const originalInnerWidth = window.innerWidth;

  afterEach(() => {
    window.innerWidth = originalInnerWidth;
  });

  it('should detect mobile viewport (<768px)', () => {
    window.innerWidth = 375;
    window.dispatchEvent(new Event('resize'));
    const { result } = renderHook(() => useDeviceType());
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isDesktop).toBe(false);
  });

  it('should detect desktop viewport (>=1024px)', () => {
    window.innerWidth = 1440;
    window.dispatchEvent(new Event('resize'));
    const { result } = renderHook(() => useDeviceType());
    expect(result.current.isDesktop).toBe(true);
    expect(result.current.isMobile).toBe(false);
  });

  it('should detect tablet viewport (768-1023px)', () => {
    window.innerWidth = 800;
    window.dispatchEvent(new Event('resize'));
    const { result } = renderHook(() => useDeviceType());
    expect(result.current.isTablet).toBe(true);
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isDesktop).toBe(false);
  });
});
