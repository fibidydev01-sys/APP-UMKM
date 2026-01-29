'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ==========================================
// AUTO-REPLY ROOT PAGE - REDIRECT TO WELCOME
// ==========================================

export default function AutoReplyPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to Welcome page as the default auto-reply tab
    router.replace('/dashboard/auto-reply/welcome');
  }, [router]);

  // Show nothing while redirecting
  return null;
}
