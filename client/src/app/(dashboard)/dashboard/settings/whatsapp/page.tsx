'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useWhatsApp } from '@/hooks/use-whatsapp';
import { onQRCode, onConnectionStatus } from '@/lib/socket';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Loader2, CheckCircle2, Phone, RefreshCw, LogOut, QrCode, AlertCircle } from 'lucide-react';
import { cn, formatPhone } from '@/lib/utils';
import type { WhatsAppStatus } from '@/types/chat';

// ==========================================
// CONSTANTS - WhatsApp Web-like timing
// ==========================================
const QR_REFRESH_INTERVAL = 20000; // 20 seconds - auto refresh QR
const QR_TIMEOUT_DURATION = 120000; // 2 minutes - stop auto refresh, show reload button

// ==========================================
// WHATSAPP CONNECTION PAGE
// ==========================================

export default function WhatsAppConnectionPage() {
  const router = useRouter();
  const {
    status,
    phoneNumber,
    qrCode,
    isConnecting,
    isDisconnecting,
    isCheckingStatus,
    connect,
    disconnect,
    checkStatus,
    setStatus,
    setQRCode,
    setPhoneNumber,
  } = useWhatsApp();

  // Track if initial auto-connect has been done (only once per page load)
  const hasAutoConnected = useRef(false);
  // Track if status came from WebSocket (not initial check)
  const isWebSocketUpdate = useRef(false);

  // Redirect to inbox when connected
  useEffect(() => {
    if (status === 'CONNECTED') {
      // Small delay for UX - show "Berhasil" briefly
      const timer = setTimeout(() => {
        router.push('/dashboard/inbox');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  // Listen to WebSocket events
  useEffect(() => {
    const unsubQR = onQRCode((data) => {
      setQRCode(data.qrCode);
      setStatus('QR_PENDING');
    });

    const unsubStatus = onConnectionStatus((data) => {
      // Mark that this status update came from WebSocket
      isWebSocketUpdate.current = true;
      setStatus(data.status as WhatsAppStatus);
      if (data.phoneNumber) {
        setPhoneNumber(data.phoneNumber);
      }
      if (data.status === 'CONNECTED') {
        setQRCode(null);
      }
    });

    // Check initial status first
    checkStatus();

    return () => {
      unsubQR();
      unsubStatus();
    };
  }, []);

  // AUTO-CONNECT: Only on initial page load when status is DISCONNECTED
  // NOT when WebSocket emits DISCONNECTED (to prevent loop)
  useEffect(() => {
    // Skip if:
    // 1. Already auto-connected once
    // 2. Currently connecting or checking status
    // 3. Status update came from WebSocket (not initial check)
    if (hasAutoConnected.current || isConnecting || isCheckingStatus) {
      return;
    }

    // Only auto-connect if DISCONNECTED and this is initial check (not WebSocket update)
    if (status === 'DISCONNECTED' && !isWebSocketUpdate.current) {
      hasAutoConnected.current = true;
      connect().catch((err) => {
        console.error('Auto-connect failed:', err);
      });
    }
  }, [status, isConnecting, isCheckingStatus, connect]);

  const handleConnect = useCallback(async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Connection failed:', error);
    }
  }, [connect]);

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Disconnect failed:', error);
    }
  }, [disconnect]);

  return (
    <div className="container max-w-2xl py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Koneksi WhatsApp</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Hubungkan akun WhatsApp Anda untuk menerima dan membalas pesan pelanggan
        </p>
      </div>

      {/* Status Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Status Koneksi</CardTitle>
            <StatusBadge status={status} />
          </div>
        </CardHeader>
        <CardContent>
          <ConnectionContent
            status={status}
            phoneNumber={phoneNumber}
            qrCode={qrCode}
            isConnecting={isConnecting}
            isDisconnecting={isDisconnecting}
            isCheckingStatus={isCheckingStatus}
            isWebSocketDisconnect={isWebSocketUpdate.current}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
        </CardContent>
      </Card>

      {/* Instructions - Only show when not connected */}
      {status !== 'CONNECTED' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cara Menghubungkan</CardTitle>
            <CardDescription>
              Ikuti langkah-langkah berikut untuk menghubungkan WhatsApp Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              <InstructionStep
                number={1}
                title="Buka WhatsApp di ponsel Anda"
                description="Buka aplikasi WhatsApp di perangkat Anda"
              />
              <InstructionStep
                number={2}
                title="Buka Pengaturan > Perangkat Tertaut"
                description="Tap menu titik tiga (⋮), pilih 'Perangkat Tertaut'"
              />
              <InstructionStep
                number={3}
                title="Tap 'Tautkan Perangkat'"
                description="Klik tombol untuk menambah perangkat baru"
              />
              <InstructionStep
                number={4}
                title="Scan QR Code"
                description="Arahkan kamera ke QR code yang tampil di atas"
              />
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ==========================================
// STATUS BADGE
// ==========================================

interface StatusBadgeProps {
  status: WhatsAppStatus;
}

function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    CONNECTED: {
      label: 'Terhubung',
      className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    },
    DISCONNECTED: {
      label: 'Terputus',
      className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    },
    QR_PENDING: {
      label: 'Menunggu Scan',
      className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    CONNECTING: {
      label: 'Menghubungkan',
      className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
  };

  const { label, className } = config[status] || config.DISCONNECTED;

  return (
    <Badge variant="outline" className={cn('font-medium', className)}>
      {label}
    </Badge>
  );
}

// ==========================================
// CONNECTION CONTENT
// ==========================================

interface ConnectionContentProps {
  status: WhatsAppStatus;
  phoneNumber: string | null;
  qrCode: string | null;
  isConnecting: boolean;
  isDisconnecting: boolean;
  isCheckingStatus: boolean;
  isWebSocketDisconnect: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

function ConnectionContent({
  status,
  phoneNumber,
  qrCode,
  isConnecting,
  isDisconnecting,
  isCheckingStatus,
  isWebSocketDisconnect,
  onConnect,
  onDisconnect,
}: ConnectionContentProps) {
  // QR Timer states
  const [qrExpired, setQrExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QR_TIMEOUT_DURATION / 1000);

  // Refs for timers
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const qrReceivedTimeRef = useRef<number>(0);

  // Cleanup all timers
  const clearAllTimers = useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  // QR Timer Logic - Start when QR code is received
  useEffect(() => {
    if (status === 'QR_PENDING' && qrCode) {
      // Reset states
      setQrExpired(false);
      setTimeLeft(QR_TIMEOUT_DURATION / 1000);
      qrReceivedTimeRef.current = Date.now();

      // Clear any existing timers
      clearAllTimers();

      // Start auto-refresh interval (every 20 seconds)
      refreshIntervalRef.current = setInterval(() => {
        // Only refresh if not expired
        if (Date.now() - qrReceivedTimeRef.current < QR_TIMEOUT_DURATION) {
          onConnect(); // This triggers new QR generation
        }
      }, QR_REFRESH_INTERVAL);

      // Start countdown timer
      countdownRef.current = setInterval(() => {
        const elapsed = Date.now() - qrReceivedTimeRef.current;
        const remaining = Math.max(0, Math.ceil((QR_TIMEOUT_DURATION - elapsed) / 1000));
        setTimeLeft(remaining);

        if (remaining <= 0) {
          setQrExpired(true);
          clearAllTimers();
        }
      }, 1000);

      // Set overall timeout (2 minutes)
      timeoutRef.current = setTimeout(() => {
        setQrExpired(true);
        clearAllTimers();
      }, QR_TIMEOUT_DURATION);
    }

    // Cleanup when status changes away from QR_PENDING
    if (status !== 'QR_PENDING') {
      clearAllTimers();
      setQrExpired(false);
    }

    return () => {
      clearAllTimers();
    };
  }, [status, qrCode, onConnect, clearAllTimers]);

  // Handle manual reload
  const handleReload = useCallback(() => {
    setQrExpired(false);
    setTimeLeft(QR_TIMEOUT_DURATION / 1000);
    qrReceivedTimeRef.current = Date.now();
    onConnect();
  }, [onConnect]);

  // ==========================================
  // RENDER STATES
  // ==========================================

  // 1. Initial loading / checking status
  if (isCheckingStatus) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-zinc-400" />
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
          Memeriksa Status...
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Mohon tunggu sebentar
        </p>
      </div>
    );
  }

  // 2. Disconnected state
  if (status === 'DISCONNECTED') {
    // If disconnect came from WebSocket (connection failed), show reconnect button
    if (isWebSocketDisconnect) {
      return (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <WifiOff className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
            Koneksi Terputus
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            Koneksi ke WhatsApp gagal. Silakan coba lagi.
          </p>
          <Button onClick={onConnect} disabled={isConnecting} size="lg">
            {isConnecting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Menghubungkan...
              </>
            ) : (
              <>
                <RefreshCw className="h-5 w-5 mr-2" />
                Hubungkan Ulang
              </>
            )}
          </Button>
        </div>
      );
    }

    // Initial auto-connecting (show loading)
    return (
      <div className="text-center py-8">
        <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-500" />
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
          Memuat QR Code...
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Menyiapkan koneksi WhatsApp
        </p>
      </div>
    );
  }

  // 3. QR Pending with QR code - Show QR
  if (status === 'QR_PENDING' && qrCode && !qrExpired) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          Scan QR code ini dengan WhatsApp di ponsel Anda
        </p>

        {/* QR Code */}
        <div className="inline-block p-4 bg-white rounded-xl shadow-lg mb-4 relative">
          <img src={qrCode} alt="WhatsApp QR Code" className="w-64 h-64" />
        </div>

        {/* Timer */}
        <div className="flex items-center justify-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-4">
          <RefreshCw className="h-4 w-4" />
          <span>
            Auto-refresh dalam {timeLeft}s
          </span>
        </div>

        {/* Manual refresh button */}
        <Button variant="outline" size="sm" onClick={handleReload} disabled={isConnecting}>
          {isConnecting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Memuat...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh QR Code
            </>
          )}
        </Button>
      </div>
    );
  }

  // 4. QR Pending but QR expired - Show reload button
  if (status === 'QR_PENDING' && qrExpired) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
        </div>
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
          QR Code Kadaluarsa
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
          QR code sudah tidak berlaku. Klik tombol di bawah untuk memuat ulang.
        </p>
        <Button onClick={handleReload} disabled={isConnecting} size="lg">
          {isConnecting ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Memuat QR...
            </>
          ) : (
            <>
              <RefreshCw className="h-5 w-5 mr-2" />
              Muat Ulang QR Code
            </>
          )}
        </Button>
      </div>
    );
  }

  // 5. QR Pending but no QR code yet - Loading QR
  if (status === 'QR_PENDING' && !qrCode) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-500" />
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
          Memuat QR Code...
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Mohon tunggu, QR code sedang dibuat
        </p>
      </div>
    );
  }

  // 6. Connecting state - After scan detected
  if (status === 'CONNECTING') {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-emerald-500" />
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
          Menghubungkan...
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          QR Code berhasil dipindai, sedang menyinkronkan
        </p>
      </div>
    );
  }

  // 7. Connected state - Show success briefly before redirect
  if (status === 'CONNECTED') {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center animate-pulse">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
          Berhasil Terhubung!
        </h3>
        {phoneNumber && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2 flex items-center justify-center gap-2">
            <Phone className="h-4 w-4" />
            {formatPhone(phoneNumber)}
          </p>
        )}
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
          Mengalihkan ke Inbox...
        </p>
        <Loader2 className="w-6 h-6 mx-auto animate-spin text-zinc-400" />
      </div>
    );
  }

  // Fallback
  return (
    <div className="text-center py-8">
      <div className="w-20 h-20 mx-auto mb-4 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
        <WifiOff className="w-10 h-10 text-zinc-400" />
      </div>
      <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
        Terjadi Kesalahan
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
        Tidak dapat memuat status koneksi
      </p>
      <Button onClick={onConnect} disabled={isConnecting} size="lg">
        {isConnecting ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Menghubungkan...
          </>
        ) : (
          <>
            <Wifi className="h-5 w-5 mr-2" />
            Coba Lagi
          </>
        )}
      </Button>
    </div>
  );
}

// ==========================================
// INSTRUCTION STEP
// ==========================================

interface InstructionStepProps {
  number: number;
  title: string;
  description: string;
}

function InstructionStep({ number, title, description }: InstructionStepProps) {
  return (
    <li className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center font-semibold text-sm">
        {number}
      </div>
      <div>
        <h4 className="font-medium text-zinc-900 dark:text-zinc-100">{title}</h4>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
      </div>
    </li>
  );
}
