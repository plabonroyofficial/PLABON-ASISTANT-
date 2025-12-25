
import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

const OfflineStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white p-2 text-center flex items-center justify-center gap-2 animate-pulse shadow-md">
      <WifiOff size={18} />
      <span className="text-sm font-medium">Internet Connection Lost. Please check your network.</span>
    </div>
  );
};

export default OfflineStatus;
