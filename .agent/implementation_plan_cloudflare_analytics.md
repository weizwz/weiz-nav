# Implementation Plan - Add Cloudflare Web Analytics

## Goal

Add Cloudflare Web Analytics to the Next.js application, ensuring it only loads in the production environment and uses a token stored in environment variables.

## Changes

### 1. Environment Configuration

- **File**: `.env.production`
- **Action**: Added `NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN` with the provided token.
- **Reason**: To store the sensitive token securely and ensure it's available in the production environment.

### 2. Root Layout Modification

- **File**: `app/layout.tsx`
- **Action**:
  - Imported `Script` from `next/script`.
  - Added conditional rendering logic to include the Cloudflare Web Analytics script only when:
    - `process.env.NODE_ENV` is `'production'`.
    - `process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN` is present.
- **Reason**: To load the analytics script only in the production environment as requested, avoiding unnecessary tracking in development.

## Verification

- **Manual Check**: Verified the content of `.env.production` and `app/layout.tsx`.
- **Logic Check**: The script uses `strategy="afterInteractive"` for optimal performance and correctly passes the token via `data-cf-beacon`.
