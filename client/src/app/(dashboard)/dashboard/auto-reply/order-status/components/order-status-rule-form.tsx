'use client';

import { useState, useRef, useEffect } from 'react';
import { useAutoReply } from '@/hooks/use-auto-reply';
import { Drawer } from 'vaul';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Info, FileText, User, Hash, DollarSign, Link2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AutoReplyRule } from '@/types/chat';

// ==========================================
// ORDER STATUS RULE FORM
// ==========================================

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending (Menunggu)',
  PROCESSING: 'Processing (Diproses)',
  COMPLETED: 'Completed (Selesai)',
  CANCELLED: 'Cancelled (Dibatalkan)',
};

const DEFAULT_TEMPLATES: Record<string, string> = {
  PENDING: `Halo {{name}}! 👋

Terima kasih sudah order!

📝 Order #{{order_number}}
💰 Total: {{total}}

Order kamu udah kami terima dan akan segera kami proses ya!

Cek status: {{tracking_link}}`,

  PROCESSING: `Hi {{name}}! 🚀

Kabar baik nih!

📦 Order #{{order_number}} sedang dalam *PROSES*

Cek status terbaru: {{tracking_link}}

Kami akan update lagi nanti! 💪`,

  COMPLETED: `Yeay! 🎉

Order #{{order_number}} udah *SELESAI*!

Terima kasih sudah order di kami {{name}}!

Jangan lupa kasih review ya ⭐⭐⭐⭐⭐

Sampai jumpa lagi! 👋`,

  CANCELLED: `Halo {{name}},

Mohon maaf, order #{{order_number}} harus kami batalkan.

Jika ada pertanyaan, silakan hubungi kami ya.

Terima kasih atas pengertiannya 🙏`,
};

const VARIABLES = [
  { key: '{{name}}', label: 'Customer Name', icon: User, description: 'Nama customer' },
  { key: '{{order_number}}', label: 'Order Number', icon: Hash, description: 'Nomor order (contoh: ORD-001)' },
  { key: '{{total}}', label: 'Total Amount', icon: DollarSign, description: 'Total pembayaran (formatted IDR)' },
  { key: '{{tracking_link}}', label: 'Tracking Link', icon: Link2, description: 'Link tracking order' },
];

interface Props {
  status: string | null;
  rule?: AutoReplyRule | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function OrderStatusRuleForm({ status, rule, open, onClose, onSuccess }: Props) {
  const { createRule, updateRule, isSaving } = useAutoReply();
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentStatus = status || (rule?.keywords?.[0] as string);
  const isEdit = !!rule;

  // Initialize message
  useEffect(() => {
    if (open) {
      if (rule) {
        setMessage(rule.responseMessage);
      } else if (currentStatus) {
        setMessage(DEFAULT_TEMPLATES[currentStatus] || '');
      }
    }
  }, [open, rule, currentStatus]);

  const insertVariable = (variable: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = message;
    const before = text.substring(0, start);
    const after = text.substring(end);

    const newText = before + variable + after;
    setMessage(newText);

    // Set cursor position after inserted variable
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + variable.length, start + variable.length);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      return;
    }

    const data = {
      name: `Order Status: ${STATUS_LABELS[currentStatus]}`,
      triggerType: 'ORDER_STATUS' as const,
      keywords: [currentStatus],
      responseMessage: message,
      isActive: true,
    };

    try {
      if (isEdit && rule) {
        await updateRule(rule.id, data);
      } else {
        await createRule(data);
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      // Error already handled by hook (toast)
    }
  };

  const handleClose = () => {
    setMessage('');
    onClose();
  };

  return (
    <Drawer.Root open={open} onOpenChange={handleClose}>
      <Drawer.Portal>
        {/* Overlay */}
        <Drawer.Overlay className="fixed inset-0 bg-black/60 z-[9999]" />

        {/* Content */}
        <Drawer.Content
          className={cn(
            'fixed bottom-0 left-0 right-0 z-[10000]',
            'bg-background rounded-t-[20px]',
            'max-h-[92vh] outline-none',
            'flex flex-col'
          )}
          aria-describedby="drawer-description"
        >
          {/* Accessibility */}
          <Drawer.Title asChild>
            <VisuallyHidden.Root>
              {isEdit ? 'Edit' : 'Create'} Rule: {STATUS_LABELS[currentStatus]}
            </VisuallyHidden.Root>
          </Drawer.Title>
          <Drawer.Description asChild>
            <VisuallyHidden.Root id="drawer-description">
              Buat template pesan yang akan dikirim otomatis saat order status berubah ke {STATUS_LABELS[currentStatus]}
            </VisuallyHidden.Root>
          </Drawer.Description>

          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-2 shrink-0">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
          </div>

          {/* Header */}
          <div className="px-4 pb-4 border-b shrink-0">
            <h2 className="font-semibold text-lg">{isEdit ? 'Edit' : 'Create'} Rule: {STATUS_LABELS[currentStatus]}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Buat template pesan yang akan dikirim otomatis saat order status berubah ke <strong>{STATUS_LABELS[currentStatus]}</strong>
            </p>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            <div className="px-4 space-y-6 py-6">
            {/* Auto-assigned Info */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">Auto-assigned by system:</p>
                  <ul className="space-y-1 ml-4">
                    <li>• <strong>Priority:</strong> 70 (High priority)</li>
                    <li>
                      • <strong>Delay:</strong>{' '}
                      {currentStatus === 'COMPLETED' ? '2s' :
                       currentStatus === 'PENDING' ? '3s' :
                       currentStatus === 'CANCELLED' ? '4s' : '5s'}
                      {' '}(Natural timing)
                    </li>
                    <li>• <strong>Trigger:</strong> Saat owner update status ke "{STATUS_LABELS[currentStatus]}"</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>

            {/* Message Template */}
            <div className="space-y-3">
              <Label htmlFor="message">
                Message Template <span className="text-red-500">*</span>
              </Label>

              {/* Variable Buttons */}
              <div className="flex flex-wrap gap-2 mb-2">
                {VARIABLES.map((variable) => {
                  const Icon = variable.icon;
                  return (
                    <Button
                      key={variable.key}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => insertVariable(variable.key)}
                      title={variable.description}
                    >
                      <Icon className="h-3 w-3 mr-1" />
                      {variable.label}
                    </Button>
                  );
                })}
              </div>

              <Textarea
                ref={textareaRef}
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ketik pesan atau gunakan default template..."
                className="min-h-[250px] font-mono text-sm"
                required
              />

              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Gunakan button di atas untuk insert variables. Variables akan diganti otomatis dengan
                data order saat pesan dikirim.
              </p>
            </div>

            {/* Message Preview */}
            {message && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Preview (Contoh):
                </Label>
                <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-md border border-zinc-200 dark:border-zinc-800">
                  <pre className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap font-sans">
                    {message
                      .replace(/\{\{name\}\}/g, 'Budi')
                      .replace(/\{\{order_number\}\}/g, 'ORD-20260129-001')
                      .replace(/\{\{total\}\}/g, 'Rp 150.000')
                      .replace(/\{\{tracking_link\}\}/g, 'https://toko.com/track/abc123')}
                  </pre>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  * Contoh preview dengan data dummy
                </p>
              </div>
            )}

            {/* Available Variables Info */}
            <div className="space-y-2">
              <Label>Available Variables:</Label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {VARIABLES.map((variable) => (
                  <div
                    key={variable.key}
                    className="flex items-start gap-2 p-2 bg-zinc-50 dark:bg-zinc-900 rounded"
                  >
                    <Badge variant="outline" className="shrink-0">
                      {variable.key}
                    </Badge>
                    <span className="text-zinc-600 dark:text-zinc-400">
                      {variable.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            </div>

            {/* Footer inside form */}
            <div className="px-4 py-4 border-t bg-background shrink-0 sticky bottom-0">
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={handleClose} disabled={isSaving}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!message.trim() || isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>{isEdit ? 'Update' : 'Create'} Rule</>
                  )}
                </Button>
              </div>
            </div>
          </form>

          {/* Floating Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur border shadow-sm hover:bg-muted transition-colors z-20"
            aria-label="Tutup"
          >
            <X className="h-4 w-4" />
          </button>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
