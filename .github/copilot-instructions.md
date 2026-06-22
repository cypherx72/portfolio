# Copilot Instructions — Portfolio

## Project overview

Personal portfolio for Tavonga Chitambira, Full-Stack Engineer.
Next.js 16 · React 19 · Tailwind 4 · TypeScript 5 · Framer Motion 12 · shadcn/ui · Vercel

## Key files

- `app/page.tsx` — entire single-page layout: left aside (sticky), right aside (scrollable), spotlight, nav, sections
- `components/section/Projects.tsx` — project card grid, update the `projects` array to change content
- `components/section/Stats.tsx` — GitHub stats and activity widgets
- `components/ui/` — shared primitives: Button, Item, Separator, etc. Do not bloat these.
- `app/globals.css` — CSS custom properties (--primary, --surface, --ink, etc.), base resets

## Coding conventions

- TypeScript strict — no `any`, explicit return types on exported functions
- Tailwind only for styling — no inline `style` unless driven by Framer Motion `useMotionValue`
- Framer Motion for all animation — use `variants` + `whileInView` + `viewport={{ once: true }}`
- `cn()` from `lib/utils.ts` for conditional class merging
- Components are functional, no class components
- No unnecessary abstractions — if a component is used once, keep it in the same file

## Animation patterns

- Entrance: `fadeUp` (opacity 0→1, y 24→0) and `fadeIn` (opacity 0→1)
- Stagger: use `custom={i}` on motion divs with `staggerChildren` on the container
- Reduced motion: always check `useReducedMotion()` before adding decorative animations

## Featured projects (source of truth for content)

### SyncBoard
Real-time multiplayer incident management platform.
Stack: Next.js, TypeScript, Socket.io, Redis, Prisma, PostgreSQL, BullMQ, Stripe, Kubernetes/EKS, Terraform, Prometheus/Grafana, Yjs CRDT, @socket.io/redis-adapter
GitHub: https://github.com/cypherx72/syncboard

## Social links (correct values)

- GitHub: https://github.com/cypherx72
- LinkedIn: https://linkedin.com/in/tavonga-chitambira
- Email: mailto:obichitas03@gmail.com
- Instagram: https://instagram.com/cypherx72  ← replace if different

## Do not

- Add new dependencies without a clear reason
- Use `useEffect` for things achievable with CSS or Framer Motion
- Add placeholder/lorem content — all content must be real
- Rename or restructure the split-panel layout without explicit instruction
