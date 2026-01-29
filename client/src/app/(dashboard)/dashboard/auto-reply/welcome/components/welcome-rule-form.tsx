'use client';

import { useState, useRef, useEffect } from 'react';
import { useAutoReply } from '@/hooks/use-auto-reply';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Info, FileText, User, Phone } from 'lucide-react';
import type { AutoReplyRule } from '@/types/chat';

// ==========================================
// WELCOME MESSAGE RULE FORM
// ==========================================

const DEFAULT_TEMPLATE = `Halo {{name}}! 👋

Terima kasih sudah menghubungi kami.

Ada yang bisa kami bantu? Silakan sampaikan kebutuhan Anda, kami siap membantu! 😊`;

const VARIABLES = [
  { key: '{{name}}', label: 'Customer Name', icon: User, description: 'Nama customer (jika tersedia)' },
  { key: '{{phone}}', label: 'Phone Number', icon: Phone, description: 'Nomor WhatsApp customer' },
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
    <Drawer open={open} onOpenChange={handleClose} direction="right">
      <DrawerContent className="max-w-3xl">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <DrawerHeader>
            <DrawerTitle>{isEdit ? 'Edit' : 'Create'} Welcome Message</DrawerTitle>
            <DrawerDescription>
              Buat pesan sambutan otomatis yang akan dikirim saat customer menghubungi bisnis Anda
              untuk pertama kalinya
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-4">
            <div className="space-y-6 py-6">
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
                placeholder="Ketik pesan sambutan..."
                className="min-h-[250px] font-mono text-sm"
                required
              />

              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Gunakan button di atas untuk insert variables. Variables akan diganti otomatis dengan
                data customer saat pesan dikirim.
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

            {/* Available Variables Info */}
            <div className="space-y-2">
              <Label>Available Variables:</Label>
              <div className="grid grid-cols-1 gap-2 text-xs">
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
          </div>

          <DrawerFooter className="border-t">
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
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
