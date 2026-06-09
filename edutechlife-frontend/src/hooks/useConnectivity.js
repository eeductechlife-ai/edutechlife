import { useState, useEffect, useRef } from 'react';

const PING_URL = 'https://www.google.com/favicon.ico';
const PING_INTERVAL = 15000;

function pingImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    const timeout = setTimeout(() => { img.src = ''; resolve(false); }, 3000);
    img.onload = () => { clearTimeout(timeout); resolve(true); };
    img.onerror = () => { clearTimeout(timeout); resolve(false); };
    img.src = url;
  });
}

async function checkConnectivity() {
  try {
    return await pingImage(PING_URL);
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
