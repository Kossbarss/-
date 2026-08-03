# User working rule

Always ask the user what to do and how to do it before taking any action. Never act on your own assumptions or personal judgment — no code changes, commits, pushes, file edits, or any other action without the user's explicit approval first.

# Hero block background animation — working, confirmed on-device

The hero background animation is finalized and confirmed working by the client on a real phone. Do not rework this without explicit request.

- **Mobile (<700px, `style.css` inside `@media (max-width: 700px)`):** the WebGL mesh-gradient shader is skipped entirely (too heavy/unstable on weak mobile GPUs — see the comment in `hero-shader-background.js`). Instead, three blurred radial-gradient blobs (`.hero::before`, `.hero::after`, `.hero > .hero-glow`) drift via CSS `transform`/`@keyframes` (`hero-mobile-blob-a/b/c`), compositor-only, no canvas.
- **Deliberate exception to reduce-motion:** the sitewide `@media (prefers-reduced-motion: reduce)` rule kills all animations by default, which silently froze these blobs for any visitor with that OS setting on (this is exactly what the client saw and reported). The client explicitly asked for this specific decorative effect to keep playing regardless — `style.css`'s reduce-motion block re-enables `animation-duration`/`animation-iteration-count` for those same three selectors on purpose. Keep that exception; don't "fix" it back to respecting reduce-motion without asking first.
- **Desktop/tablet (>700px):** the WebGL shader in `hero-shader-background.js` is a hand-rolled reproduction of the original `@paper-design/shaders-react` `MeshGradient` component (verified against the real npm package v0.0.77). `baseFrame`/`overlayFrame` advance at `0.3`/`0.2` per ms of delta — this must match the original component's `speed` props (base MeshGradient `speed=0.3`, overlay `speed=0.2`); it was previously miscopied as `0.9`/`0.6` (3x too fast) and has been corrected.
- When testing locally, remember `server.js` serves the **built** `_site/` output, not the raw source files — run `npm run build` after editing `style.css` or `hero-shader-background.js` before testing locally, or changes won't show up.
