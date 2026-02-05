'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatNumber, isValidYouTubeVideoUrl, isValidYouTubeChannelUrl } from '@/lib/utils';

interface LinkItem {
  id: string;
  url: string;
  quantity: number;
  error?: string;
}

interface MultiLinkInputProps {
  totalQuantity: number;
  serviceType: string;
  links: LinkItem[];
  onLinksChange: (links: LinkItem[]) => void;
  maxLinks?: number;
}

// Generate unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Auto-distribute quantity across links
const distributeQuantity = (totalQty: number, linkCount: number): number[] => {
  if (linkCount === 0) return [];
  const base = Math.floor(totalQty / linkCount);
  const remainder = totalQty % linkCount;
  return Array(linkCount)
    .fill(base)
    .map((q, i) => (i < remainder ? q + 1 : q));
};

// Validate YouTube URL based on service type
const validateUrl = (url: string, serviceType: string): string | null => {
  if (!url.trim()) return null; // Empty is ok, will be caught on submit
  
  const isChannelService = serviceType === 'subscribers';
  
  if (isChannelService) {
    if (!isValidYouTubeChannelUrl(url)) {
      return 'Please enter a valid YouTube channel URL';
    }
  } else {
    if (!isValidYouTubeVideoUrl(url)) {
      return 'Please enter a valid YouTube video URL';
    }
  }
  
  return null;
};

export function MultiLinkInput({
  totalQuantity,
  serviceType,
  links,
  onLinksChange,
  maxLinks = 10,
}: MultiLinkInputProps) {
  const isChannelService = serviceType === 'subscribers';
  const placeholder = isChannelService
    ? 'https://youtube.com/@channel'
    : 'https://youtube.com/watch?v=...';
  const label = isChannelService ? 'YouTube Channel URL' : 'YouTube Video URL';

  // Redistribute quantity when total or link count changes
  useEffect(() => {
    if (links.length > 0) {
      const quantities = distributeQuantity(totalQuantity, links.length);
      const updatedLinks = links.map((link, i) => ({
        ...link,
        quantity: quantities[i] || 0,
      }));
      
      // Only update if quantities actually changed
      const hasChanged = links.some((link, i) => link.quantity !== quantities[i]);
      if (hasChanged) {
        onLinksChange(updatedLinks);
      }
    }
  }, [totalQuantity, links.length]);

  const addLink = () => {
    if (links.length >= maxLinks) return;
    
    const newLinks = [...links, { id: generateId(), url: '', quantity: 0 }];
    const quantities = distributeQuantity(totalQuantity, newLinks.length);
    const updatedLinks = newLinks.map((link, i) => ({
      ...link,
      quantity: quantities[i] || 0,
    }));
    onLinksChange(updatedLinks);
  };

  const removeLink = (id: string) => {
    if (links.length <= 1) return;
    
    const newLinks = links.filter((link) => link.id !== id);
    const quantities = distributeQuantity(totalQuantity, newLinks.length);
    const updatedLinks = newLinks.map((link, i) => ({
      ...link,
      quantity: quantities[i] || 0,
    }));
    onLinksChange(updatedLinks);
  };

  const updateLink = (id: string, url: string) => {
    const error = validateUrl(url, serviceType);
    const updatedLinks = links.map((link) =>
      link.id === id ? { ...link, url, error: error || undefined } : link
    );
    onLinksChange(updatedLinks);
  };

  const getUnitLabel = (): string => {
    switch (serviceType) {
      case 'views': return 'views';
      case 'subscribers': return 'subscribers';
      case 'likes': return 'likes';
      case 'comments': return 'comments';
      case 'watch_time': return 'hours';
      default: return 'units';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <LinkIcon className="h-4 w-4 text-rose-500" />
          {label}
          {links.length > 1 && (
            <span className="text-xs text-slate-500">
              ({formatNumber(totalQuantity)} {getUnitLabel()} split across {links.length} links)
            </span>
          )}
        </label>
      </div>

      <div className="space-y-2">
        {links.map((link, index) => (
          <div key={link.id} className="group">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => updateLink(link.id, e.target.value)}
                  placeholder={placeholder}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl border-2 transition-all duration-200',
                    'focus:outline-none focus:ring-0',
                    link.error
                      ? 'border-red-300 bg-red-50 focus:border-red-500'
                      : 'border-slate-200 bg-white focus:border-rose-500'
                  )}
                />
                
                {/* Quantity badge */}
                {links.length > 1 && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 rounded-lg bg-slate-100 text-xs font-medium text-slate-600">
                    {formatNumber(link.quantity)} {getUnitLabel()}
                  </div>
                )}
              </div>
              
              {/* Remove button (only if more than 1 link) */}
              {links.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLink(link.id)}
                  className="flex items-center justify-center w-12 h-12 rounded-xl border-2 border-slate-200 text-slate-400 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {/* Error message */}
            {link.error && (
              <div className="flex items-center gap-1 mt-1 text-xs text-red-500">
                <AlertCircle className="h-3 w-3" />
                {link.error}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Link Button */}
      {links.length < maxLinks && (
        <button
          type="button"
          onClick={addLink}
          className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-rose-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm font-medium">Add Another Link</span>
          <span className="text-xs text-slate-400 ml-auto">
            (Split quantity across multiple videos)
          </span>
        </button>
      )}

      {/* Info text */}
      <p className="text-xs text-slate-500">
        {links.length > 1
          ? `Your ${formatNumber(totalQuantity)} ${getUnitLabel()} will be evenly distributed across ${links.length} links.`
          : 'Add more links to split your order across multiple videos.'}
      </p>
    </div>
  );
}
