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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Info, FileText, User, Phone, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AutoReplyRule } from '@/types/chat';

// ==========================================
// KEYWORD RULE FORM
// ==========================================

const VARIABLES = [
  { key: '{{name}}', label: 'NAMA', icon: User, description: 'Nama customer (jika tersedia)' },
  { key: '{{phone}}', label: 'TELEPON', icon: Phone, description: 'Nomor WhatsApp customer' },
];

const MATCH_TYPES = [
  { value: 'CONTAINS', label: 'Contains (mengandung kata)', description: 'Cocok jika pesan mengandung keyword' },
  { value: 'EXACT', label: 'Exact Match (sama persis)', description: 'Cocok jika pesan sama persis dengan keyword' },
  { value: 'STARTS_WITH', label: 'Starts With (diawali)', description: 'Cocok jika pesan diawali dengan keyword' },
];

interface Props {
  rule?: AutoReplyRule | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function KeywordRuleForm({ rule, open, onClose, onSuccess }: Props) {
  const { createRule, updateRule, isSaving } = useAutoReply();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [matchType, setMatchType] = useState<'EXACT' | 'CONTAINS' | 'STARTS_WITH'>('CONTAINS');
  const [caseSensitive, setCaseSensitive] = useState(false);
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
        setDescription(rule.description || '');
        setKeywords(rule.keywords || []);
        setMatchType(rule.matchType as any || 'CONTAINS');
        setCaseSensitive(rule.caseSensitive || false);
        setMessage(rule.responseMessage);
      } else {
        setName('');
        setDescription('');
        setKeywords([]);
        setKeywordInput('');
        setMatchType('CONTAINS');
        setCaseSensitive(false);
        setMessage('');
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

  const addKeyword = () => {
    const trimmed = keywordInput.trim();
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  const handleKeywordInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || keywords.length === 0 || !message.trim()) {
      return;
    }

    const data = {
      name: name.trim(),
      description: description.trim() || undefined,
      triggerType: 'KEYWORD' as const,
      keywords,
      matchType,
      caseSensitive,
      responseMessage: message,
      isActive: true,
      // Priority 50, delay 2s (auto-assigned by backend)
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
    setDescription('');
    setKeywords([]);
    setKeywordInput('');
    setMatchType('CONTAINS');
    setCaseSensitive(false);
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
              {isEdit ? 'Edit' : 'Create'} Keyword Rule
            </VisuallyHidden.Root>
          </Drawer.Title>
          <Drawer.Description asChild>
            <VisuallyHidden.Root id="drawer-description">
              Buat rule untuk membalas otomatis saat customer mengirim kata kunci tertentu
            </VisuallyHidden.Root>
          </Drawer.Description>

          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-2 shrink-0">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
          </div>

          {/* Header */}
          <div className="px-4 pb-4 border-b shrink-0">
            <h2 className="font-semibold text-lg">{isEdit ? 'Edit' : 'Create'} Keyword Rule</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Buat rule untuk membalas otomatis saat customer mengirim kata kunci tertentu
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
                    <li>• <strong>Priority:</strong> 50 (Medium priority)</li>
                    <li>• <strong>Delay:</strong> 2s (Natural timing)</li>
                    <li>• <strong>Trigger:</strong> Customer message matches any of the keywords</li>
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
                placeholder="e.g., Info Harga"
                required
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Nama untuk identifikasi rule ini
              </p>
            </div>

            {/* Description (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Balas otomatis untuk pertanyaan harga"
              />
            </div>

            {/* Keywords */}
            <div className="space-y-3">
              <Label>
                Keywords <span className="text-red-500">*</span>
              </Label>

              {/* Keyword Input */}
              <div className="flex gap-2">
                <Input
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleKeywordInputKeyDown}
                  placeholder="Ketik keyword dan tekan Enter..."
                />
                <Button type="button" variant="outline" onClick={addKeyword}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>

              {/* Keywords List */}
              {keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800">
                  {keywords.map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="text-sm">
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(keyword)}
                        className="ml-2 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Tambahkan kata kunci yang akan memicu auto-reply (minimal 1 keyword)
              </p>
            </div>

            {/* Match Type */}
            <div className="space-y-2">
              <Label htmlFor="matchType">Match Type</Label>
              <Select value={matchType} onValueChange={(value: any) => setMatchType(value)}>
                <SelectTrigger id="matchType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MATCH_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{type.label}</span>
                        <span className="text-xs text-zinc-500">{type.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Case Sensitive */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="caseSensitive"
                checked={caseSensitive}
                onCheckedChange={(checked) => setCaseSensitive(checked as boolean)}
              />
              <Label
                htmlFor="caseSensitive"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Case Sensitive (membedakan huruf besar/kecil)
              </Label>
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
                placeholder="Ketik pesan balasan..."
                className="min-h-[200px] font-mono text-sm"
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
              </div>
            )}
            </div>

            {/* Footer inside form */}
            <div className="px-4 py-4 border-t bg-background shrink-0 sticky bottom-0">
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={handleClose} disabled={isSaving}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!name.trim() || keywords.length === 0 || !message.trim() || isSaving}
                >
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
