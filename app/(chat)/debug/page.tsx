'use client';

import { useEffect, useState } from 'react';

export default function DebugPage() {
  const [envStatus, setEnvStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkEnv = async () => {
      try {
        const response = await fetch('/api/debug');
        const data = await response.json();
        setEnvStatus(data);
      } catch (error) {
        console.error('Error checking environment:', error);
        setEnvStatus({ error: 'Failed to check environment' });
      } finally {
        setLoading(false);
      }
    };

    checkEnv();
  }, []);

  if (loading) {
    return <div className="p-4">Checking environment...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Environment Debug</h1>
      {envStatus ? (
        <div className="space-y-2">
          <div>Status: {envStatus.status}</div>
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Environment Variables:</h2>
            <ul className="list-disc pl-5 mt-2">
              {Object.entries(envStatus.environment).map(([key, value]) => (
                <li key={key} className={value === 'MISSING' ? 'text-red-500' : 'text-green-500'}>
                  {key}: {value as string}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div>No environment data available</div>
      )}
    </div>
  );
}