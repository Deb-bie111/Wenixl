# Later. — Complete Project Source Files & Self-Hosting Guide

This document contains all source files for the **Later.** time capsule application, configured with the olive-green theme and animated quill writing experience.

---

## 1. Project Structure

```
later-app/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── types.ts
    ├── components/
    │   ├── QuillAnimation.tsx
    │   ├── CreateCapsule.tsx
    │   ├── Dashboard.tsx
    │   ├── CapsuleCard.tsx
    │   ├── CapsuleDetail.tsx
    │   ├── Header.tsx
    │   ├── LandingPage.tsx
    │   ├── AuthModal.tsx
    │   ├── ProfileSettingsModal.tsx
    │   └── EmailPreviewModal.tsx
    ├── data/
    │   ├── prompts.ts
    │   └── stationery.ts
    ├── services/
    │   └── storage.ts
    └── utils/
        └── date.ts
```

---

## 2. Dependencies & Build Configuration

### `package.json`
```json
{
  "name": "later-time-capsule",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.0.0",
    "canvas-confetti": "^1.9.4",
    "lucide-react": "^1.16.0",
    "motion": "^12.4.7",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0"
  },
  "devDependencies": {
    "@types/canvas-confetti": "^1.9.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "~5.7.2",
    "vite": "^6.1.0"
  }
}
```

### `vite.config.ts`
```ts
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### `index.html`
```html
<!doctype html>
<html lang="en" class="h-full bg-[#F7F9F5]">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Later. — A time capsule for your future self</title>
    <meta name="description" content="Write letters, seal photos and memories to be unlocked on a chosen date in the future." />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
  </head>
  <body class="h-full antialiased text-[#1F2A1A] bg-[#F7F9F5] selection:bg-[#CCD8C4] selection:text-[#1F2A1A]">
    <div id="root" class="min-h-full flex flex-col"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### `src/index.css`
```css
@import "tailwindcss";

@layer base {
  body {
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  .font-serif {
    font-family: 'Newsreader', Georgia, Cambria, 'Times New Roman', Times, serif;
  }
}
```

---

## 3. Quick Host Instructions

### Option 1: Deploy to Vercel
1. Run `npm install`
2. Run `npm run build` (outputs to `dist/`)
3. Connect repository to [Vercel](https://vercel.com) — it detects Vite automatically.

### Option 2: Deploy to Netlify / GitHub Pages / Cloudflare Pages
Drop the compiled `dist/` directory directly into Netlify Drop or Cloudflare Pages.
