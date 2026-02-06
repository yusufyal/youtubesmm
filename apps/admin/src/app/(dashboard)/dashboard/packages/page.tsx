'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Package as PackageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import adminApi from '@/lib/api';
import type { Package, Service, Provider } from '@/types';

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterService, setFilterService] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    service_id: '',
    quantity: 100,
    price: 0,
    original_price: 0,
    provider_id: '',
    provider_service_id: '',
    estimated_time: '24-48 hours',
    min_quantity: 10,
    max_quantity: 10000,
    description: '',
    features: '',
    active: true,
    featured: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [packagesRes, servicesRes, providersRes] = await Promise.all([
        adminApi.getPackages(),
        adminApi.getServices(),
        adminApi.getProviders(),
      ]);
      setPackages(Array.isArray(packagesRes) ? packagesRes : []);
      setServices(Array.isArray(servicesRes) ? servicesRes : []);
      setProviders(Array.isArray(providersRes) ? providersRes : []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateDialog = () => {
    setEditingPackage(null);
    setFormData({
      name: '',
      service_id: services[0]?.id?.toString() || '',
      quantity: 100,
      price: 0,
      original_price: 0,
      provider_id: '',
      provider_service_id: '',
      estimated_time: '24-48 hours',
      min_quantity: 10,
      max_quantity: 10000,
      description: '',
      features: '',
      active: true,
      featured: false,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (pkg: Package) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name || '',
      service_id: pkg.service_id?.toString() || '',
      quantity: pkg.quantity || 100,
      price: pkg.price || 0,
      original_price: pkg.original_price || 0,
      provider_id: pkg.provider_id?.toString() || '',
      provider_service_id: pkg.provider_service_id || '',
      estimated_time: pkg.estimated_time || '24-48 hours',
      min_quantity: pkg.min_quantity || 10,
      max_quantity: pkg.max_quantity || 10000,
      description: pkg.description || '',
      features: Array.isArray(pkg.features) ? pkg.features.join('\n') : '',
      active: pkg.active ?? true,
      featured: pkg.featured ?? false,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dataToSubmit = {
        ...formData,
        service_id: parseInt(formData.service_id),
        provider_id: formData.provider_id ? parseInt(formData.provider_id) : undefined,
        features: formData.features.split('\n').filter((f) => f.trim()),
      };

      if (editingPackage) {
        await adminApi.updatePackage(editingPackage.id, dataToSubmit as any);
      } else {
        await adminApi.createPackage(dataToSubmit as any);
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save package:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this package?')) return;

    try {
      await adminApi.deletePackage(id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete package:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.service?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesService =
      filterService === 'all' || pkg.service_id?.toString() === filterService;
    return matchesSearch && matchesService;
  });

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
          <h1 className="text-2xl font-bold tracking-tight">Packages</h1>
          <p className="text-muted-foreground">Manage service packages and pricing</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Package
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search packages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterService} onValueChange={setFilterService}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            {services.map((service) => (
              <SelectItem key={service.id} value={service.id.toString()}>
                {service.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Packages Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Packages</CardTitle>
          <CardDescription>{packages.length} packages total</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPackages.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No packages found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm font-medium text-muted-foreground">
                    <th className="pb-3 pr-4">Package</th>
                    <th className="pb-3 pr-4">Service</th>
                    <th className="pb-3 pr-4">Quantity</th>
                    <th className="pb-3 pr-4">Price</th>
                    <th className="pb-3 pr-4">Provider</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPackages.map((pkg) => (
                    <tr key={pkg.id} className="border-b">
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <PackageIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{pkg.name}</p>
                            {pkg.featured && (
                              <Badge variant="warning" className="text-xs">Featured</Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-4">{pkg.service?.name || 'N/A'}</td>
                      <td className="py-4 pr-4">{pkg.quantity?.toLocaleString()}</td>
                      <td className="py-4 pr-4">
                        <div>
                          <p className="font-medium">{formatCurrency(pkg.price)}</p>
                          {(pkg.original_price ?? 0) > pkg.price && (
                            <p className="text-sm text-muted-foreground line-through">
                              {formatCurrency(pkg.original_price ?? 0)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 pr-4 text-sm text-muted-foreground">
                        {providers.find((p) => p.id === pkg.provider_id)?.name || 'Not set'}
                      </td>
                      <td className="py-4 pr-4">
                        <Badge variant={pkg.active ? 'success' : 'secondary'}>
                          {pkg.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(pkg)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(pkg.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPackage ? 'Edit Package' : 'Create Package'}</DialogTitle>
            <DialogDescription>
              {editingPackage ? 'Update the package details' : 'Add a new service package'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Package Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., 1000 YouTube Views"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service_id">Service</Label>
                <Select
                  value={formData.service_id}
                  onValueChange={(value) => setFormData({ ...formData, service_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id.toString()}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="original_price">Original Price ($)</Label>
                <Input
                  id="original_price"
                  type="number"
                  step="0.01"
                  value={formData.original_price}
                  onChange={(e) => setFormData({ ...formData, original_price: parseFloat(e.target.value) || 0 })}
                  placeholder="For strikethrough"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="provider_id">Provider</Label>
                <Select
                  value={formData.provider_id || 'none'}
                  onValueChange={(value) => setFormData({ ...formData, provider_id: value === 'none' ? '' : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {providers.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id.toString()}>
                        {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider_service_id">Provider Service ID</Label>
                <Input
                  id="provider_service_id"
                  value={formData.provider_service_id}
                  onChange={(e) => setFormData({ ...formData, provider_service_id: e.target.value })}
                  placeholder="e.g., 123"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="estimated_time">Delivery Time</Label>
                <Input
                  id="estimated_time"
                  value={formData.estimated_time}
                  onChange={(e) => setFormData({ ...formData, estimated_time: e.target.value })}
                  placeholder="e.g., 24-48 hours"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="min_quantity">Min Quantity</Label>
                <Input
                  id="min_quantity"
                  type="number"
                  value={formData.min_quantity}
                  onChange={(e) => setFormData({ ...formData, min_quantity: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_quantity">Max Quantity</Label>
                <Input
                  id="max_quantity"
                  type="number"
                  value={formData.max_quantity}
                  onChange={(e) => setFormData({ ...formData, max_quantity: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Package description..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">Features (one per line)</Label>
              <Textarea
                id="features"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                placeholder="Real views&#10;Fast delivery&#10;Money-back guarantee"
                rows={4}
              />
            </div>

            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
                <Label htmlFor="active">Active</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
                <Label htmlFor="featured">Featured</Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editingPackage ? 'Update Package' : 'Create Package'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
