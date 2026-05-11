# AGENTS.md — PlanetsSystemSim

## Quick start

```sh
npm install        # install dependencies
npm start          # dev server at http://localhost:4200
npm run build      # production build → dist/bundle.js
npm test           # jest (coverage on by default)
npm run eslint     # eslint on src/
npm run eslint:fix # eslint --fix
```

## Architecture

- **Entry:** `src/index.ts` — bootstraps canvas, planets, UI panels, and the game loop
- **Models** (`src/models/`): `Dot` (physical body), `Vector` (polar coords), `System` (container), `Tracker` (camera follow, singleton), `Drawer` (canvas rendering)
- **Controller** (`src/controller/`): `TranslateController` — pan/zoom via keyboard (WASD + arrows + R reset + Q/E scale) and mouse (drag + wheel). Singleton.
- **UI** (`src/ui/components/`): `BasePanel`, `InfoPanel`, `PlanetsListPanel` (with search/sort/autoupdate), `PlanetInfoModal`
- **Utils** (`src/utils/`): `math.ts` (toRadians/toDegrees/round), `throttle.ts`, `canvas/handlers.ts`

## Path aliases (tsconfig + webpack)

| Alias | Resolves to |
|-------|-------------|
| `@models/*` | `src/models/*` |
| `@utils/*` | `src/utils/*` |
| `@components/*` | `src/ui/components/*` |

## Testing

- Test root: `tests/` mirrors `src/` structure under `tests/unit/`
- Test files: `*.test.ts` / `*.test.tsx`
- Jest preset `ts-jest`, environment `jsdom`, coverage always collected
- CSS mocked via `identity-obj-proxy`, static files via `tests/__mocks__/fileMock.js`
- Setup: `tests/setup.ts` defines window.innerWidth/Height
- Tests access private members via `panel["element"]` bracket notation (existing pattern)

## Code conventions

- Interfaces prefixed `I` (PascalCase), classes PascalCase, files lowercase
- `const` by default; `let` only for reassignment
- Arrow functions for callbacks
- JSDoc on public APIs in Russian (existing convention, keep consistent)
- Commit messages in Russian, imperative mood: "Добавлен рендер орбит"
- `import type` for type-only imports (`draw.ts`)

## Gotchas

- Dev server runs on **port 4200** (README says 8080 — kept from old config)
- Physics tick is 30ms `setInterval`; render loop is `requestAnimationFrame` — separate loops, not synced
- `Tracker` and `TranslateController` are singletons — constructors return existing instance
- `PlanetsListPanel.focusOnPlanet` accesses `(window as any).translateInstance` (no import, relies on global)
- Gravity constant `GRAVCONST = 1` hardcoded in `dot.ts`
- Orbit history capped at 500 points (`draw.ts`)
- Tests accessing private members: `obj["privateField"]` is the existing style
- No CI workflows, no pre-commit hooks, no tslint in active use

## Style guidance

- 2-space indent, 1TBS brace style
- Import groups: external → parent → sibling → index → type (enforced by eslint `import/order`)
- Reject `any` type (`@typescript-eslint/no-explicit-any: error`)
- `no-unused-vars` is error (TypeScript-eslint), prefix unused params with `_`
