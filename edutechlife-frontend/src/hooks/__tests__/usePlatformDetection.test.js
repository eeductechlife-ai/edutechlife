import { renderHook } from '@testing-library/react';
import { usePlatformDetection, usePlatformStyles, usePlatformClasses } from '../usePlatformDetection';

const originalUA = navigator.userAgent;
const originalDPR = window.devicePixelRatio;
const originalMaxTouch = navigator.maxTouchPoints;

function setUA(ua) {
  Object.defineProperty(navigator, 'userAgent', {
    configurable: true, get: () => ua,
  });
}

function setTouch(maxPoints) {
  Object.defineProperty(navigator, 'maxTouchPoints', {
    configurable: true, get: () => maxPoints,
  });
  if (maxPoints > 0) {
    Object.defineProperty(window, 'ontouchstart', {
      configurable: true, value: () => {},
    });
  } else {
    delete window.ontouchstart;
  }
}

function setDPR(dpr) {
  Object.defineProperty(window, 'devicePixelRatio', {
    configurable: true, get: () => dpr,
  });
}

function restore() {
  Object.defineProperty(navigator, 'userAgent', {
    configurable: true, get: () => originalUA,
  });
  Object.defineProperty(navigator, 'maxTouchPoints', {
    configurable: true, get: () => originalMaxTouch,
  });
  Object.defineProperty(window, 'devicePixelRatio', {
    configurable: true, get: () => originalDPR,
  });
  delete window.ontouchstart;
}

function runHook() {
  return renderHook(() => usePlatformDetection()).result;
}

describe('usePlatformDetection', () => {
  afterEach(restore);

  test('detects desktop Chrome', () => {
    setUA('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36');
    setDPR(2);
    setTouch(0);
    const r = runHook();
    expect(r.current).toMatchObject({ isDesktop: true, isChrome: true, isMobile: false, isTablet: false });
  });

  test('detects iPhone iOS Safari', () => {
    setUA('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
    setDPR(3);
    setTouch(5);
    const r = runHook();
    expect(r.current).toMatchObject({ isIOS: true, isMobile: true, isSafari: true, isTouchDevice: true, isHiDPI: true });
  });

  test('detects iPad tablet (also mobile due to Mobile in UA string)', () => {
    setUA('Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
    setDPR(2);
    setTouch(5);
    const r = runHook();
    expect(r.current).toMatchObject({ isTablet: true, isIOS: true, isMobile: true });
  });

  test('detects Android mobile', () => {
    setUA('Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.230 Mobile Safari/537.36');
    setDPR(2.625);
    setTouch(5);
    const r = runHook();
    expect(r.current).toMatchObject({ isAndroid: true, isMobile: true, isChrome: true });
  });

  test('detects Firefox desktop', () => {
    setUA('Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:120.0) Gecko/20100101 Firefox/120.0');
    setDPR(1);
    setTouch(0);
    const r = runHook();
    expect(r.current).toMatchObject({ isFirefox: true, isDesktop: true, isMobile: false });
  });

  test('HiDPI is false when pixel ratio < 2', () => {
    setUA('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36');
    setDPR(1);
    setTouch(0);
    const r = runHook();
    expect(r.current.isHiDPI).toBe(false);
  });
});

describe('usePlatformStyles', () => {
  afterEach(restore);

  test('no platform-specific styles on base desktop', () => {
    setUA('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36');
    setDPR(1);
    setTouch(0);
    const { result } = renderHook(() => usePlatformStyles());
    expect(result.current.getOptimizedStyles({ color: 'red' })).toEqual({ color: 'red' });
  });

  test('Webkit tap highlight on iOS', () => {
    setUA('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
    setTouch(5);
    const { result } = renderHook(() => usePlatformStyles());
    const s = result.current.getOptimizedStyles({});
    expect(s.WebkitTapHighlightColor).toBe('rgba(0, 188, 212, 0.1)');
  });

  test('softens box shadow on iOS', () => {
    setUA('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
    setTouch(5);
    const { result } = renderHook(() => usePlatformStyles());
    const s = result.current.getOptimizedStyles({ boxShadow: '0 0.05rem 0' });
    expect(s.WebkitBoxShadow).toBe('0 0.03rem 0');
  });

  test('touchAction manipulation on Android', () => {
    setUA('Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.230 Mobile Safari/537.36');
    setTouch(5);
    const { result } = renderHook(() => usePlatformStyles());
    const s = result.current.getOptimizedStyles({});
    expect(s.touchAction).toBe('manipulation');
    expect(s.userSelect).toBe('none');
  });

  test('cursor pointer and minHeight on touch devices', () => {
    setUA('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
    setTouch(5);
    const { result } = renderHook(() => usePlatformStyles());
    const s = result.current.getOptimizedStyles({});
    expect(s.cursor).toBe('pointer');
    expect(s.minHeight).toBe('44px');
  });

  test('does not override existing minHeight on touch', () => {
    setUA('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
    setTouch(5);
    const { result } = renderHook(() => usePlatformStyles());
    const s = result.current.getOptimizedStyles({ minHeight: '60px' });
    expect(s.minHeight).toBe('60px');
  });

  test('imageRendering crisp-edges on HiDPI', () => {
    setUA('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36');
    setDPR(2);
    const { result } = renderHook(() => usePlatformStyles());
    const s = result.current.getOptimizedStyles({});
    expect(s.imageRendering).toBe('crisp-edges');
  });

  test('combines multiple platform optimizations', () => {
    setUA('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
    setTouch(5);
    setDPR(3);
    const { result } = renderHook(() => usePlatformStyles());
    const s = result.current.getOptimizedStyles({});
    expect(s.WebkitTapHighlightColor).toBe('rgba(0, 188, 212, 0.1)');
    expect(s.cursor).toBe('pointer');
    expect(s.imageRendering).toBe('crisp-edges');
  });
});

describe('usePlatformClasses', () => {
  afterEach(restore);

  test('desktop adds desktop-optimized class', () => {
    setUA('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36');
    setDPR(1);
    setTouch(0);
    const { result } = renderHook(() => usePlatformClasses());
    expect(result.current.getOptimizedClasses('')).toBe('desktop-optimized');
  });

  test('iOS mobile appends ios touch mobile classes', () => {
    setUA('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
    setTouch(5);
    const { result } = renderHook(() => usePlatformClasses());
    const c = result.current.getOptimizedClasses('');
    expect(c).toContain('ios-optimized');
    expect(c).toContain('touch-optimized');
    expect(c).toContain('mobile-optimized');
  });

  test('Android touch appends android touch classes', () => {
    setUA('Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.230 Mobile Safari/537.36');
    setTouch(5);
    const { result } = renderHook(() => usePlatformClasses());
    const c = result.current.getOptimizedClasses('');
    expect(c).toContain('android-optimized');
    expect(c).toContain('touch-optimized');
  });

  test('tablet appends tablet class', () => {
    setUA('Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
    setTouch(5);
    const { result } = renderHook(() => usePlatformClasses());
    const c = result.current.getOptimizedClasses('');
    expect(c).toContain('tablet-optimized');
    expect(c).toContain('touch-optimized');
  });

  test('preserves base classes on desktop', () => {
    setUA('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36');
    setDPR(1);
    setTouch(0);
    const { result } = renderHook(() => usePlatformClasses());
    expect(result.current.getOptimizedClasses('text-white p-4')).toBe('text-white p-4 desktop-optimized');
  });

  test('combines all applicable classes', () => {
    setUA('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
    setTouch(5);
    setDPR(3);
    const { result } = renderHook(() => usePlatformClasses());
    const c = result.current.getOptimizedClasses('base');
    expect(c).toBe('base ios-optimized touch-optimized hidpi-optimized mobile-optimized');
  });
});
