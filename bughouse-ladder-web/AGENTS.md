# AGENTS.md

## Build and Development Commands

### Development
- **Start the development server**: `npm run dev`
- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`

### Code Quality
- **Run ESLint** (all files): `npm run lint`
- **Format your code**: Project uses ESLint (no separate formatter specified)
- **Type checking**: TypeScript is used via `tsc -b` in build scripts

### Testing
- **Run all tests**: Test files not configured in package.json
- **Run tests from source code**: Tests can be run via the `runTests` function in `src/components/LadderForm.tsx:416`

## Code Style Guidelines

### Imports
1. React hooks and utilities first: `import { useState, useEffect, useRef } from 'react'`
2. Then component imports: `import LadderForm from './components/LadderForm'`
3. External libraries: import in dependency order (e.g., UI libraries first)
4. Local imports last: `import './css/index.css'`

### Components
1. **Functional components only** with `export default`
2. Components use **PascalCase** naming convention
3. Always include **type annotations** for props interfaces
4. Default export for React components: `export default function ComponentName()`
5. Props with default values syntax: `function Component({ prop }: Props = {})`
6. Return JSX with `<></>` (Fragment) when needed for multiple siblings
7. Components should not have side effects in render (use useEffect for initialization)

### TypeScript
1. All files must be `.tsx` or `.ts`
2. Use **strict types** and optional chaining (`?.`) frequently
3. Provide fallback values: `value || defaultValue`
4. Type literals for unions: `'status' | 'error' | 'loading'`
5. Nullish coalescing: `col[0] || ''` instead of `col[0]`
6. Avoid `any` types; use proper interfaces or utility types
7. Explicitly type state variable initial values
8. Use TypeScript enums when appropriate

### Naming Conventions
- **Components**: PascalCase (e.g., `LadderForm`, `Settings`, `App`)
- **Functions**: camelCase (e.g., `loadPlayers`, `handleSort`, `recalculateRatings`)
- **Variables**: camelCase (e.g., `players`, `isWide`, `fileName`)
- **Constants**: UPPER_SNAKE_CASE if global (less common in this project)
- **Interfaces/types**: PascalCase (e.g., `PlayerData`, `LadderFormProps`)
- **File names**: match component names (e.g., `LadderForm.tsx`, `App.tsx`)

### Styling
1. Use **inline styles** with template literals for component-specific styles
2. Consistent spacing: `padding: '0.5rem'`, `gap: '1rem'`, `margin: '1rem'`
2. Use hex colors (no standard color names preferred as per codebase)
3. Consistent spacing values: use `0.5rem` for small, `1rem` for medium spacing
4. Grid templates: `gridTemplateColumns: 'repeat(4, 1fr)'`
5. Border radius values: `0.25rem`, `0.5rem`, `9999px` (pill shape)
6. Font sizes: `'0.75rem'`, `'0.875rem'`, `'1rem'`, `'1.25rem'`, `'1.5rem'`
7. Style objects should be consistent with one another

### Error Handling
1. Always use try-catch for localStorage operations: `try { localStorage.setItem(...) } catch (err) {}`
2. Validate inputs before parsing: `if (col[4] && !isNaN(parseInt(col[4])))`
3. Null safety: `e.target?.result`, `file?.[0]`, `prevChar ? prevChar.match(pattern) : null`
4. Fallback values for parsing: `parseInt(cols[4] || '0')`, `value || ''`
5. Error logging to console: `console.error('Error message', err)`
6. Graceful degradation for missing data

### React Best Practices
1. **Hooks must be at the top** of functional components, before any return statement
2. **Avoid side effects** in render functions - use useEffect or useMemo
3. **Key props** required for list rendering: `{items.map((item) => <div key={item.id}>`}
4. **Event handlers** should be properly typed: `onClick={() => handleChange()}`
5. **Ref API** for accessing DOM elements: `useRef<HTMLInputElement>(null)`
6. **Conditional rendering**: `{condition && <Component />}` or ternary operators
7. **Immutable updates**: `setPlayers(prev => ({ ...prev, ...newData }))`

### Formatting and Organization
1. Group logical statements together in functions
2. Import statements at the top of each file (no inline imports)
3. Comments explaining complex logic (especially parsing logic)
4. Logical grouping: state declarations, handlers, and JSX separated
5. Keep functions focused on single responsibility
6. Use `const` for immutable references, `let` for mutable (rare in this codebase)

### Accessibility
1. Use proper button labels and semantic HTML
2. Accessibility attributes where needed: `aria-label`, `role`
3. Keyboard navigation considerations for interactive elements
4. Focus management for modal/overlays (the `Settings` component follows this)

### File Structure
1. Root: `src/` - Contains components, types, utilities
2. Components: `src/components/` - Named exports if needed
3. Types: `src/types.ts` - Shared interfaces and types
4. CSS: `src/css/` - Module styles (currently `src/css/index.css`)
5. Entry point: `src/main.tsx`

### External Libraries
1. **lucide-react**: Icon library - Use `import { IconName } from 'lucide-react'`
2. **SheetJS/xlsx**: Excel file handling
3. **@tanstack/react-table**: Table component and features

### Known Code Base Issues to Avoid
1. Don't duplicate extensive logic (code duplication observed in `runTests` function due to debugging logs)
2. Don't use `any` type assignments when proper typing exists
3. Don't access localStorage synchronously in render without checks
4. Don't mutate state directly; always use setter functions
5. Don't inline complex event handlers that reference local variables

## Getting Started for New Agents

1. Run `npm install` to install dependencies
2. Use `npm run dev` to start a hot reload server
3. All TypeScript files must pass the build check
4. Run `npm run lint` before committing changes
5. Follow the naming conventions and component patterns used in existing files
6. Test changes locally before pushing by running the build and lint commands