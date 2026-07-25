'use client'

import { useState, useEffect } from "react"

export default function Home() {
  const [status, setStatus] = useState('checking...');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`)
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus('error'));
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1>Supervolt Backend Status: {status}</h1>
    </main>
  );
}