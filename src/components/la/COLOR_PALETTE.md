Allowed Tailwind Color Palette for `la` components

Use only the following Tailwind color families in `components/la/*` and in design-system examples.
All color tokens should use the standard Tailwind names and scales (lowercase):

- rose
- red
- amber
- yellow
- lime
- emerald
- sky
- blue
- purple
- slate
- gray
- zinc
- neutral
- stone

Guidelines
- Prefer semantic variables (if available) that map to these families (for example: `--la-accent: theme('colors.blue.500')`).
- Do not introduce other Tailwind families (e.g., `pink`, `green`) unless explicitly approved.
- When specifying classes, use the color scale (e.g. `text-slate-900`, `bg-amber-50`, `border-red-500`).
- For muted/secondary text use `slate` or `gray` scales.

If you'd like, I can:
- Scan the `components/la` folder and replace non-approved color families automatically, or
- Add ESLint/Tailwind lint rules to enforce the palette.
