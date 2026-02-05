'use client';

import { useState, useEffect } from 'react';
import { Save, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import adminApi from '@/lib/api';

interface Settings {
  // General
  site_name: string;
  site_url: string;
  support_email: string;
  // Payment
  stripe_enabled: boolean;
  stripe_public_key: string;
  stripe_secret_key: string;
  tap_enabled: boolean;
  tap_public_key: string;
  tap_secret_key: string;
  // SEO
  default_seo_title: string;
  default_meta_description: string;
  google_analytics_id: string;
  google_site_verification: string;
  facebook_pixel_id: string;
  // Notifications
  order_notification_email: string;
  low_balance_alert: boolean;
  low_balance_threshold: number;
}

const defaultSettings: Settings = {
  site_name: 'AYN YouTube',
  site_url: 'https://ayn.yt',
  support_email: 'support@ayn.yt',
  stripe_enabled: false,
  stripe_public_key: '',
  stripe_secret_key: '',
  tap_enabled: false,
  tap_public_key: '',
  tap_secret_key: '',
  default_seo_title: 'Buy YouTube Views, Likes & Subscribers | AYN YouTube',
  default_meta_description: 'Get real YouTube views, likes, and subscribers. Fast delivery, 24/7 support, and money-back guarantee.',
  google_analytics_id: '',
  google_site_verification: '',
  facebook_pixel_id: '',
  order_notification_email: '',
  low_balance_alert: true,
  low_balance_threshold: 100,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await adminApi.getSettings();
      if (response && typeof response === 'object') {
        setSettings({ ...defaultSettings, ...response });
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      await adminApi.updateSettings(settings);
      setSaveMessage({ type: 'success', text: 'Settings saved successfully!' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error: any) {
      setSaveMessage({ type: 'error', text: error.message || 'Failed to save settings' });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleShowSecret = (key: string) => {
    setShowSecrets({ ...showSecrets, [key]: !showSecrets[key] });
  };

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings({ ...settings, [key]: value });
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
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your application settings</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>

      {saveMessage && (
        <div
          className={`p-4 rounded-lg ${
            saveMessage.type === 'success'
              ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
              : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
          }`}
        >
          {saveMessage.text}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="seo">SEO & Analytics</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic site configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="site_name">Site Name</Label>
                  <Input
                    id="site_name"
                    value={settings.site_name}
                    onChange={(e) => updateSetting('site_name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site_url">Site URL</Label>
                  <Input
                    id="site_url"
                    type="url"
                    value={settings.site_url}
                    onChange={(e) => updateSetting('site_url', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="support_email">Support Email</Label>
                <Input
                  id="support_email"
                  type="email"
                  value={settings.support_email}
                  onChange={(e) => updateSetting('support_email', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="space-y-4">
          {/* Stripe */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Stripe</CardTitle>
                  <CardDescription>Accept credit card payments via Stripe</CardDescription>
                </div>
                <Switch
                  checked={settings.stripe_enabled}
                  onCheckedChange={(checked) => updateSetting('stripe_enabled', checked)}
                />
              </div>
            </CardHeader>
            {settings.stripe_enabled && (
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stripe_public_key">Publishable Key</Label>
                  <Input
                    id="stripe_public_key"
                    value={settings.stripe_public_key}
                    onChange={(e) => updateSetting('stripe_public_key', e.target.value)}
                    placeholder="pk_live_..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stripe_secret_key">Secret Key</Label>
                  <div className="relative">
                    <Input
                      id="stripe_secret_key"
                      type={showSecrets.stripe ? 'text' : 'password'}
                      value={settings.stripe_secret_key}
                      onChange={(e) => updateSetting('stripe_secret_key', e.target.value)}
                      placeholder="sk_live_..."
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => toggleShowSecret('stripe')}
                    >
                      {showSecrets.stripe ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Tap Payments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tap Payments</CardTitle>
                  <CardDescription>Accept payments in GCC region via Tap</CardDescription>
                </div>
                <Switch
                  checked={settings.tap_enabled}
                  onCheckedChange={(checked) => updateSetting('tap_enabled', checked)}
                />
              </div>
            </CardHeader>
            {settings.tap_enabled && (
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tap_public_key">Public Key</Label>
                  <Input
                    id="tap_public_key"
                    value={settings.tap_public_key}
                    onChange={(e) => updateSetting('tap_public_key', e.target.value)}
                    placeholder="pk_live_..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tap_secret_key">Secret Key</Label>
                  <div className="relative">
                    <Input
                      id="tap_secret_key"
                      type={showSecrets.tap ? 'text' : 'password'}
                      value={settings.tap_secret_key}
                      onChange={(e) => updateSetting('tap_secret_key', e.target.value)}
                      placeholder="sk_live_..."
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => toggleShowSecret('tap')}
                    >
                      {showSecrets.tap ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </TabsContent>

        {/* SEO & Analytics */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO & Analytics</CardTitle>
              <CardDescription>Search engine optimization and tracking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Default SEO */}
              <div className="space-y-4">
                <h4 className="font-medium">Default SEO</h4>
                <div className="space-y-2">
                  <Label htmlFor="default_seo_title">Default Title</Label>
                  <Input
                    id="default_seo_title"
                    value={settings.default_seo_title}
                    onChange={(e) => updateSetting('default_seo_title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default_meta_description">Default Meta Description</Label>
                  <Textarea
                    id="default_meta_description"
                    value={settings.default_meta_description}
                    onChange={(e) => updateSetting('default_meta_description', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              {/* Analytics */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium">Analytics & Tracking</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="google_analytics_id">Google Analytics ID</Label>
                    <Input
                      id="google_analytics_id"
                      value={settings.google_analytics_id}
                      onChange={(e) => updateSetting('google_analytics_id', e.target.value)}
                      placeholder="G-XXXXXXXXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebook_pixel_id">Facebook Pixel ID</Label>
                    <Input
                      id="facebook_pixel_id"
                      value={settings.facebook_pixel_id}
                      onChange={(e) => updateSetting('facebook_pixel_id', e.target.value)}
                      placeholder="123456789"
                    />
                  </div>
                </div>
              </div>

              {/* Verification */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium">Site Verification</h4>
                <div className="space-y-2">
                  <Label htmlFor="google_site_verification">Google Site Verification</Label>
                  <Input
                    id="google_site_verification"
                    value={settings.google_site_verification}
                    onChange={(e) => updateSetting('google_site_verification', e.target.value)}
                    placeholder="Verification code or meta tag content"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="order_notification_email">Order Notification Email</Label>
                <Input
                  id="order_notification_email"
                  type="email"
                  value={settings.order_notification_email}
                  onChange={(e) => updateSetting('order_notification_email', e.target.value)}
                  placeholder="admin@example.com"
                />
                <p className="text-sm text-muted-foreground">
                  Receive email notifications for new orders
                </p>
              </div>

              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="low_balance_alert">Low Balance Alert</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when provider balance is low
                    </p>
                  </div>
                  <Switch
                    id="low_balance_alert"
                    checked={settings.low_balance_alert}
                    onCheckedChange={(checked) => updateSetting('low_balance_alert', checked)}
                  />
                </div>

                {settings.low_balance_alert && (
                  <div className="space-y-2">
                    <Label htmlFor="low_balance_threshold">Threshold Amount ($)</Label>
                    <Input
                      id="low_balance_threshold"
                      type="number"
                      value={settings.low_balance_threshold}
                      onChange={(e) =>
                        updateSetting('low_balance_threshold', parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
