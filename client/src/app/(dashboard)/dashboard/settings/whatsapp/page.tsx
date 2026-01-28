'use client';

import { useEffect, useCallback } from 'react';
import { useWhatsApp } from '@/hooks/use-whatsapp';
import { onQRCode, onConnectionStatus } from '@/lib/socket';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Loader2, CheckCircle2, Phone, RefreshCw, LogOut } from 'lucide-react';
import { cn, formatPhone } from '@/lib/utils';
import type { WhatsAppStatus } from '@/types/chat';

// ==========================================
// WHATSAPP CONNECTION PAGE
// ==========================================

export default function WhatsAppConnectionPage() {
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

  // Listen to WebSocket events
  useEffect(() => {
    const unsubQR = onQRCode((data) => {
      setQRCode(data.qrCode);
      setStatus('QR_PENDING');
    });

    const unsubStatus = onConnectionStatus((data) => {
      setStatus(data.status as WhatsAppStatus);
      if (data.phoneNumber) {
        setPhoneNumber(data.phoneNumber);
      }
      if (data.status === 'CONNECTED') {
        setQRCode(null);
      }
    });

    // Check initial status
    checkStatus();

    return () => {
      unsubQR();
      unsubStatus();
    };
  }, []);

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
          {isCheckingStatus ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            </div>
          ) : (
            <ConnectionContent
              status={status}
              phoneNumber={phoneNumber}
              qrCode={qrCode}
              isConnecting={isConnecting}
              isDisconnecting={isDisconnecting}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              onRefresh={checkStatus}
            />
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
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
              title="Klik tombol 'Hubungkan WhatsApp'"
              description="Sistem akan membuat QR code untuk autentikasi"
            />
            <InstructionStep
              number={2}
              title="Buka WhatsApp di ponsel Anda"
              description="Buka aplikasi WhatsApp di perangkat Anda"
            />
            <InstructionStep
              number={3}
              title="Buka Pengaturan > Perangkat Tertaut"
              description="Tap menu titik tiga, pilih 'Perangkat Tertaut'"
            />
            <InstructionStep
              number={4}
              title="Scan QR Code"
              description="Arahkan kamera ke QR code yang tampil di layar"
            />
            <InstructionStep
              number={5}
              title="Selesai!"
              description="WhatsApp Anda sudah terhubung dan siap digunakan"
            />
          </ol>
        </CardContent>
      </Card>
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
  onConnect: () => void;
  onDisconnect: () => void;
  onRefresh: () => void;
}

function ConnectionContent({
  status,
  phoneNumber,
  qrCode,
  isConnecting,
  isDisconnecting,
  onConnect,
  onDisconnect,
  onRefresh,
}: ConnectionContentProps) {
  // Disconnected state
  if (status === 'DISCONNECTED') {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 mx-auto mb-4 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
          <WifiOff className="w-10 h-10 text-zinc-400" />
        </div>
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
          WhatsApp Belum Terhubung
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
          Klik tombol di bawah untuk menghubungkan akun WhatsApp Anda
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
              Hubungkan WhatsApp
            </>
          )}
        </Button>
      </div>
    );
  }

  // QR Pending state - only show if QR code exists
  if (status === 'QR_PENDING' && qrCode) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          Scan QR code ini dengan WhatsApp di ponsel Anda
        </p>
        <div className="inline-block p-4 bg-white rounded-xl shadow-lg mb-4">
          <img src={qrCode} alt="WhatsApp QR Code" className="w-64 h-64" />
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
          QR code akan refresh otomatis jika kadaluarsa
        </p>
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh QR Code
        </Button>
      </div>
    );
  }

  // Connecting state
  if (status === 'CONNECTING') {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-emerald-500" />
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
          Menghubungkan...
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Mohon tunggu sebentar</p>
      </div>
    );
  }

  // Connected state
  if (status === 'CONNECTED') {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
          WhatsApp Terhubung
        </h3>
        {phoneNumber && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1 flex items-center justify-center gap-2">
            <Phone className="h-4 w-4" />
            {formatPhone(phoneNumber)}
          </p>
        )}
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
          Anda dapat menerima dan membalas pesan pelanggan
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Cek Status
          </Button>
          <Button variant="destructive" onClick={onDisconnect} disabled={isDisconnecting}>
            {isDisconnecting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Memutuskan...
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4 mr-2" />
                Putuskan Koneksi
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Fallback - treat unknown status as disconnected
  return (
    <div className="text-center py-8">
      <div className="w-20 h-20 mx-auto mb-4 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
        <WifiOff className="w-10 h-10 text-zinc-400" />
      </div>
      <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
        WhatsApp Belum Terhubung
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
        Klik tombol di bawah untuk menghubungkan akun WhatsApp Anda
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
            Hubungkan WhatsApp
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
