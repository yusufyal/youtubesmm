<?php

use App\Jobs\SyncOrderStatusJob;
use Illuminate\Support\Facades\Schedule;

Schedule::job(new SyncOrderStatusJob)->everyFiveMinutes();
