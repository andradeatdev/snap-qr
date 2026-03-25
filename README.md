# SnapQR

High-performance web application for instant, custom QR code generation with multi-format payload support.

## What it does

- **Multiple Payload Types**: Generates QR codes for URL, Plain Text, Wi-Fi, vCard, Phone, SMS, Email, Events, Geo-location, PIX (EMVCo), and 2FA (TOTP).
- **Real-time Preview**: Immediate visual feedback during data entry using client-side rendering.
- **Dynamic Formatting**: Automatic encoding for complex protocols like WIFI, mailto, and VCARD.
- **PIX Integration**: Native support for Brazilian instant payment payloads.
- **Privacy-First**: All generation occurs in the browser; no payload data is sent to a backend.

## Stack

- **Framework**: Next.js 16 (App Router), React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4, Shadcn/UI (Radix UI)
- **QR Engine**: qr-code-styling
- **Payment Logic**: pix-payload
- **Tooling**: Biome (Linting & Formatting)

## How to run

1. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Technical Decisions

- **SSR Compatibility**: `qr-code-styling` uses browser-only APIs. It is loaded via Next.js `dynamic` imports with `ssr: false` to prevent hydration mismatches and server-side crashes.
- **Client-Side Generation**: QR codes are generated directly in the user's browser, ensuring privacy for sensitive payloads like 2FA secrets and PIX keys.
- **Performance Tooling**: Biome is used for linting and formatting, providing faster feedback cycles than ESLint/Prettier.

## Project Structure

- `app/`: Next.js App Router pages and providers.
- `components/`: UI components and specialized `QRCodeDisplay` logic.
- `lib/`: Type definitions and utility functions.
- `public/`: Static assets and brand icons.
