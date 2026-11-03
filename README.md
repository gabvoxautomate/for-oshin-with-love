# For Oshin, With Love

A mobile-first birthday keepsake book built with React, TypeScript, Vite, and `react-pageflip`. The reader includes 3D page turns, touch and mouse flipping, a rotatable cover, chapter progress, and animated letter text.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`.

## Personal assets

The chapter photos are in `public/images/` and are paired with their chapters in this order:

1. `oshin-chapter-1.png` — coral gele and pale-blue lace dress
2. `oshin-chapter-2.jpg` — white dress and fascinator
3. `oshin-chapter-3.jpg` — white polo shirt and green vegetation
4. `oshin-chapter-4.jpg` — pink T-shirt outdoors
5. `oshin-chapter-5.jpg` — white button-up shirt, pink headband, and jeans

Additional supplied photographs appear in the closing pages:

- `oshin-memory-1.jpg` — Oshin in a black outfit and tan cap
- `oshin-friendship.jpg` — Oshin and Timileyin together outdoors
- `oshin-memory-2.jpg` — Oshin in a red dress

The birthday soundtrack is `public/audio/birthday-music.mp3`. It starts after the reader opens the book.

## Deploy to Vercel

Push this repository to GitHub, import it in Vercel, and use the default Vite settings:

- Build command: `npm run build`
- Output directory: `dist`
