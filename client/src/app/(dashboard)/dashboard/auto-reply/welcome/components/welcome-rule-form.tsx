'use client';

import { useState, useRef, useEffect } from 'react';
import { useAutoReply } from '@/hooks/use-auto-reply';
import { Drawer } from 'vaul';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Info, FileText, User, Phone, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AutoReplyRule } from '@/types/chat';

// ==========================================
// WELCOME MESSAGE RULE FORM
// ==========================================

const DEFAULT_TEMPLATE = `Halo {{name}}! 👋

Terima kasih sudah menghubungi kami.

Ada yang bisa kami bantu? Silakan sampaikan kebutuhan Anda, kami siap membantu! 😊`;

const VARIABLES = [
  { key: '{{name}}', label: 'NAMA', icon: User, description: 'Nama customer (jika tersedia)' },
  { key: '{{phone}}', label: 'TELEPON', icon: Phone, description: 'Nomor WhatsApp customer' },
];

interface Props {
  rule?: AutoReplyRule | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function WelcomeRuleForm({ rule, open, onClose, onSuccess }: Props) {
  const { createRule, updateRule, isSaving } = useAutoReply();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isEdit = !!rule;

  // Helper: Check if variable exists in message
  const hasVariable = (varKey: string) => {
    return message.includes(varKey);
  };

  // Helper: Get active variables in message
  const getActiveVariables = () => {
    return VARIABLES.filter((v) => message.includes(v.key));
  };

  // Helper: Remove variable from message
  const removeVariable = (varKey: string) => {
    setMessage(message.replace(new RegExp(varKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), ''));
  };

  // Initialize form
  useEffect(() => {
    if (open) {
      if (rule) {
        setName(rule.name);
        setMessage(rule.responseMessage);
      } else {
        setName('Welcome Message');
        setMessage(DEFAULT_TEMPLATE);
      }
    }
  }, [open, rule]);

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

    if (!name.trim() || !message.trim()) {
      return;
    }

    const data = {
      name: name.trim(),
      triggerType: 'WELCOME' as const,
      responseMessage: message,
      isActive: true,
      // Priority and delay will be auto-assigned by backend (100, 2s)
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
    setName('');
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
              {isEdit ? 'Edit' : 'Create'} Welcome Message
            </VisuallyHidden.Root>
          </Drawer.Title>
          <Drawer.Description asChild>
            <VisuallyHidden.Root id="drawer-description">
              Buat pesan sambutan otomatis yang akan dikirim saat customer menghubungi bisnis Anda untuk pertama kalinya
            </VisuallyHidden.Root>
          </Drawer.Description>

          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-2 shrink-0">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
          </div>

          {/* Header */}
          <div className="px-4 pb-4 border-b shrink-0">
            <h2 className="font-semibold text-lg">{isEdit ? 'Edit' : 'Create'} Welcome Message</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Buat pesan sambutan otomatis yang akan dikirim saat customer menghubungi bisnis Anda untuk pertama kalinya
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
                    <li>• <strong>Priority:</strong> 100 (Highest - sent first before other rules)</li>
                    <li>• <strong>Delay:</strong> 2s (Quick response for first contact)</li>
                    <li>• <strong>Trigger:</strong> Customer sends first message via WhatsApp</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>

            {/* Rule Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Rule Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Welcome Message"
                required
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Nama untuk identifikasi rule ini
              </p>
            </div>

            {/* Message Template */}
            <div className="space-y-3">
              <Label htmlFor="message">
                Message Template <span className="text-red-500">*</span>
              </Label>

              {/* Add Variable Buttons */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    Tambah Variabel:
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {VARIABLES.map((variable) => {
                      const Icon = variable.icon;
                      const isUsed = hasVariable(variable.key);
                      return (
                        <Button
                          key={variable.key}
                          type="button"
                          variant={isUsed ? "secondary" : "outline"}
                          size="sm"
                          onClick={() => insertVariable(variable.key)}
                          disabled={isUsed}
                          title={isUsed ? `${variable.label} sudah digunakan` : variable.description}
                          className="h-7 text-xs"
                        >
                          <Icon className="h-3 w-3 mr-1" />
                          {variable.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Variables Chips */}
                {getActiveVariables().length > 0 && (
                  <div className="flex items-center gap-2">
                    <Label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      Variabel Aktif:
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {getActiveVariables().map((variable) => {
                        const Icon = variable.icon;
                        return (
                          <Badge
                            key={variable.key}
                            variant="default"
                            className="pl-2 pr-1 py-1 gap-1 text-xs font-medium rounded-full"
                          >
                            <Icon className="h-3 w-3" />
                            <span>{variable.label}</span>
                            <button
                              type="button"
                              onClick={() => removeVariable(variable.key)}
                              className="ml-1 rounded-full hover:bg-white/20 p-0.5 transition-colors"
                              title={`Hapus ${variable.label}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <Textarea
                ref={textareaRef}
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ketik pesan sambutan..."
                className="min-h-[250px] font-mono text-sm"
                required
              />

              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Klik variabel di atas untuk menambahkan ke pesan. Variabel akan otomatis diganti dengan data customer saat pesan dikirim.
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
                      .replace(/\{\{name\}\}/g, 'Customer')
                      .replace(/\{\{phone\}\}/g, '+62812345678')}
                  </pre>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  * Contoh preview dengan data dummy. Jika customer name tidak tersedia, akan
                  menggunakan fallback "Customer"
                </p>
              </div>
            )}
            </div>

            {/* Footer inside form */}
            <div className="px-4 py-4 border-t bg-background shrink-0 sticky bottom-0">
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={handleClose} disabled={isSaving}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!name.trim() || !message.trim() || isSaving}>
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
