<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'platform',
        'type',
        'description',
        'short_description',
        'icon',
        'seo_title',
        'meta_description',
        'schema_data',
        'active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'schema_data' => 'array',
            'active' => 'boolean',
        ];
    }

    public function packages(): HasMany
    {
        return $this->hasMany(Package::class)->orderBy('sort_order')->orderBy('price');
    }

    public function activePackages(): HasMany
    {
        return $this->hasMany(Package::class)->where('active', true)->orderBy('sort_order')->orderBy('price');
    }

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    public function scopeByPlatform($query, string $platform)
    {
        return $query->where('platform', $platform);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
