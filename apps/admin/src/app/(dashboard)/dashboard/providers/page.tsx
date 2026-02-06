'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, TestTube, RefreshCw, ExternalLink, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import adminApi from '@/lib/api';
import type { Provider } from '@/types';

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testingId, setTestingId] = useState<number | null>(null);
  const [testResults, setTestResults] = useState<Record<number, { success: boolean; balance?: number; error?: string }>>({});

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    api_url: '',
    api_key: '',
    active: true,
  });

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await adminApi.getProviders();
      setProviders(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Failed to fetch providers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateDialog = () => {
    setEditingProvider(null);
    setFormData({
      name: '',
      api_url: '',
      api_key: '',
      active: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (provider: Provider) => {
    setEditingProvider(provider);
    setFormData({
      name: provider.name || '',
      api_url: provider.api_url || '',
      api_key: '', // Don't show existing API key for security
      active: provider.active ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dataToSubmit = { ...formData };
      // Only include api_key if it's provided (for updates, empty means don't change)
      if (editingProvider && !formData.api_key) {
        delete (dataToSubmit as any).api_key;
      }

      if (editingProvider) {
        await adminApi.updateProvider(editingProvider.id, dataToSubmit);
      } else {
        await adminApi.createProvider(dataToSubmit);
      }
      setIsDialogOpen(false);
      fetchProviders();
    } catch (error) {
      console.error('Failed to save provider:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this provider? This will affect all packages linked to it.')) return;

    try {
      await adminApi.deleteProvider(id);
      fetchProviders();
    } catch (error) {
      console.error('Failed to delete provider:', error);
    }
  };

  const handleTest = async (provider: Provider) => {
    setTestingId(provider.id);
    try {
      const result = await adminApi.testProvider(provider.id);
      setTestResults({
        ...testResults,
        [provider.id]: result,
      });
    } catch (error: any) {
      setTestResults({
        ...testResults,
        [provider.id]: { success: false, error: error.message },
      });
    } finally {
      setTestingId(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Providers</h1>
          <p className="text-muted-foreground">Manage SMM panel API providers</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Provider
        </Button>
      </div>

      {/* Providers Grid */}
      {providers.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No providers configured. Add your first API provider to start accepting orders.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {providers.map((provider) => (
            <Card key={provider.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{provider.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      {provider.api_url}
                    </CardDescription>
                  </div>
                  <Badge variant={provider.active ? 'success' : 'secondary'}>
                    {provider.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Balance Display */}
                  {provider.balance !== undefined && (
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm text-muted-foreground">Balance</span>
                      <span className="text-lg font-semibold">
                        {formatCurrency(provider.balance)}
                      </span>
                    </div>
                  )}

                  {/* Test Result */}
                  {testResults[provider.id] && (
                    <div
                      className={`flex items-center gap-2 p-3 rounded-lg ${
                        testResults[provider.id].success
                          ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
                          : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                      }`}
                    >
                      {testResults[provider.id].success ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span className="text-sm">
                            Connected! Balance: {formatCurrency(testResults[provider.id].balance || 0)}
                          </span>
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4" />
                          <span className="text-sm">{testResults[provider.id].error}</span>
                        </>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleTest(provider)}
                      disabled={testingId === provider.id}
                    >
                      {testingId === provider.id ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <TestTube className="mr-2 h-4 w-4" />
                      )}
                      Test
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(provider)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(provider.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProvider ? 'Edit Provider' : 'Add Provider'}</DialogTitle>
            <DialogDescription>
              {editingProvider
                ? 'Update the provider configuration'
                : 'Add a new SMM panel API provider'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Provider Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., SMMKings"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">API URL</Label>
              <Input
                id="url"
                type="url"
                value={formData.api_url}
                onChange={(e) => setFormData({ ...formData, api_url: e.target.value })}
                placeholder="https://provider.com/api/v2"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="api_key">
                API Key {editingProvider && '(leave empty to keep current)'}
              </Label>
              <Input
                id="api_key"
                type="password"
                value={formData.api_key}
                onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                placeholder={editingProvider ? '••••••••' : 'Enter API key'}
                required={!editingProvider}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, active: checked })
                }
              />
              <Label htmlFor="active">Active</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editingProvider ? 'Update' : 'Add Provider'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
