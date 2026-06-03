import { useState, useEffect, useRef } from 'react';

const PING_URL = 'https://clerk.accounts.dev/.well-known/favicon.ico';
const PING_INTERVAL = 15000;

async function checkConnectivity() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(PING_URL, { method: 'HEAD', mode: 'no-cors', signal: controller.signal });
    clearTimeout(timeout);
    return true;
  } catch {
    return navigator.onLine;
  }
}

export default function useConnectivity() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const intervalRef = useRef(null);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    const verify = async () => {
      const connected = await checkConnectivity();
      setIsOnline(connected);
    };

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    intervalRef.current = setInterval(verify, PING_INTERVAL);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return isOnline;
}
