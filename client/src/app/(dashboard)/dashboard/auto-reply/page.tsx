'use client';

import { useEffect, useState } from 'react';
import { useAutoReply } from '@/hooks/use-auto-reply';
import { RuleCard } from '@/components/auto-reply';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Bot, Loader2 } from 'lucide-react';
import Link from 'next/link';

// ==========================================
// AUTO-REPLY RULES LIST PAGE
// ==========================================

export default function AutoReplyPage() {
  const { rules, isLoading, isDeleting, fetchRules, toggleRule, deleteRule } = useAutoReply();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const handleDelete = async () => {
    if (deleteId) {
      await deleteRule(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Auto-Reply</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Kelola aturan balasan otomatis untuk pelanggan Anda
          </p>
        </div>

        <Button asChild>
          <Link href="/dashboard/auto-reply/new">
            <Plus className="h-4 w-4 mr-2" />
            Buat Aturan
          </Link>
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <RulesListSkeleton />
      ) : rules.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4">
          {rules
            .sort((a, b) => b.priority - a.priority)
            .map((rule) => (
              <RuleCard key={rule.id} rule={rule} onToggle={toggleRule} onDelete={setDeleteId} />
            ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Aturan Auto-Reply?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Aturan auto-reply ini akan dihapus secara
              permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ==========================================
// SKELETON LOADING
// ==========================================

function RulesListSkeleton() {
  return (
    <div className="grid gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="p-6 border rounded-lg">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-6 w-12" />
          </div>
          <Skeleton className="h-16 w-full mb-3" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// EMPTY STATE
// ==========================================

function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto mb-6 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
        <Bot className="w-10 h-10 text-zinc-400" />
      </div>
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
        Belum Ada Aturan Auto-Reply
      </h2>
      <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-md mx-auto">
        Buat aturan auto-reply untuk membalas pesan pelanggan secara otomatis berdasarkan kata
        kunci, waktu, atau pesan pertama.
      </p>
      <Button asChild size="lg">
        <Link href="/dashboard/auto-reply/new">
          <Plus className="h-5 w-5 mr-2" />
          Buat Aturan Pertama
        </Link>
      </Button>
    </div>
  );
}
