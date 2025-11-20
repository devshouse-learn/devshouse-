# DevsHouse - Copilot Instructions for AI Agents

## Project Overview
DevsHouse is an educational-labor connection platform built with **React 19 + Vite** that connects schools, entrepreneurs, and companies through four main service modules: educational agreements, ventures, job postings, and job search with AI assistance.

## Architecture & Component Structure

### Clean Architecture Pattern
The project follows clean architecture principles with strict separation:
- **Components** (`src/components/`): UI-only, no business logic
- **Services** (`src/services/`): Business logic and API abstraction
- **Config** (`src/config/constants.js`): Centralized configuration
- **Layout** (`src/components/layout/`): Persistent header, footer, and AI assistant

### Service Layer Pattern
All API interactions go through `apiService` (singleton pattern in `src/services/api.service.js`):
- Does NOT use axios or external HTTP libraries—uses native `fetch()` with AbortController for timeout handling
- Domain-specific services (`agreementsService`, `venturesService`, `jobsService`, `candidatesService`) wrap API calls with semantic method names (e.g., `agreementsService.create(data)`)
- Services are exported as objects with methods, not classes

### Routing Structure
- All routes nested under `<Layout>` wrapper in `App.jsx`
- Five main routes: `/`, `/agreements`, `/ventures`, `/jobs`, `/job-search`
- Layout persists Header, Footer, and AIAssistant across all pages
- Page components currently use placeholder templates; implement actual form components by replacing placeholders in `App.jsx`

## Development Workflows

### Run Commands
```bash
cd frontend
npm install        # One-time setup
npm run dev        # Start dev server (http://localhost:5173)
npm run build      # Production build
npm run lint       # ESLint check
npm run preview    # Preview production build
```

### Adding New Components
1. Create component in `src/components/[feature-name]/ComponentName.jsx`
2. Add corresponding `.css` file in same directory (scoped styles only)
3. Import and use in parent component or route
4. Reference `src/components/home/` or `src/components/layout/` as pattern examples

### Adding New Routes
1. Create page component (or replace placeholder in `App.jsx`)
2. Add route in `App.jsx` Routes config
3. Add route constant to `ROUTES` in `src/config/constants.js`
4. Update navigation links in `Header.jsx` if needed

## Code Patterns & Conventions

### Component Files
- Use `.jsx` extension for all components
- Functional components with hooks only (no class components)
- Default export at end of file
- Import CSS as separate files (not CSS-in-JS)

### Service Calls
```javascript
// ✅ CORRECT: Use domain service with semantic naming
import { jobsService } from './services/registration.service';
const jobs = await jobsService.getAll();

// ❌ AVOID: Direct apiService calls in components
const data = await apiService.post('/jobs', {...});
```

### API Configuration
- Base URL: `import.meta.env.VITE_API_URL` → defaults to `http://localhost:3000/api`
- Timeout: 10000ms (set in `API_CONFIG`)
- Headers: Auto-includes `'Content-Type': 'application/json'`
- **No authentication headers yet** (JWT auth planned for future)

### CSS Organization
- **Global styles**: `src/styles/globals.css` (variables, animations, resets)
- **Component styles**: Separate `.css` file per component in same directory
- **Design tokens** in globals.css:
  - Colors: primary (BlueViolet), secondary (DeepPink), accent (Cyan)
  - Gradients: `--gradient-primary`, `--gradient-secondary`, `--gradient-accent`
  - Animations: `fadeIn`, `slideUp`, `bounce`, `pulse`, `float` (0.6s-1s durations)
- Responsive breakpoints not explicitly defined—design is fluid CSS Grid/Flexbox

### Error Handling Pattern
- API errors logged to console in `apiService.request()`
- Callers must handle errors with try-catch
- No error boundary component exists yet

## Data Flow & Integration Points

### Component → Service → API Flow
```
React Component (e.g., form submission)
  ↓
Domain Service (e.g., venturesService.create(data))
  ↓
apiService (handles fetch + timeout + JSON parsing)
  ↓
Backend API (http://localhost:3000/api/ventures)
```

### Form Submission Pattern (Template)
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const result = await venturesService.create(formData);
    // Show success message
  } catch (error) {
    // Show error message
  }
};
```

### Environment Variables
- Define in `frontend/.env` (not committed)
- Reference via `import.meta.env.VITE_*` (Vite convention)
- Available at build time only (not runtime)

## Key Files & What They Control

| File | Purpose |
|------|---------|
| `src/App.jsx` | Router config, route definitions |
| `src/config/constants.js` | API URL, routes, community links |
| `src/services/api.service.js` | HTTP client (fetch singleton) |
| `src/services/registration.service.js` | Domain services (CRUD methods) |
| `src/components/layout/Layout.jsx` | Page wrapper, Outlet for routes |
| `src/styles/globals.css` | Design tokens, animations, resets |
| `frontend/package.json` | Dependencies, build scripts |

## Project-Specific Patterns NOT to Miss

1. **No backend yet**: API endpoints are placeholders; backend at `/api/*` coming later
2. **No authentication**: JWT/auth planning but not implemented—no login component
3. **Community links**: WhatsApp/Discord URLs in constants for each service (agreements, ventures, jobs, candidates)
4. **AI Assistant**: `AIAssistant.jsx` is a mock UI component with hardcoded responses; actual AI integration pending
5. **Placeholder forms**: `AgreementsPage`, `VenturesPage`, `JobsPage`, `JobSearchPage` in `App.jsx` are inline templates—replace with real form components
6. **No custom hooks yet**: Plan to add `useForm`, `useValidation`, `useApi` utilities (not yet created)

## When Adding Features

- **New service endpoint?** Add corresponding domain service method in `registration.service.js`
- **New page?** Create component, add route in `App.jsx`, update `constants.js` ROUTES
- **New data?** Extend service methods, keep API surface in `registration.service.js`
- **New animation?** Add to `globals.css` with similar naming (`@keyframes fadeIn {...}`)
- **Styling?** Use CSS variables from globals, create scoped `.css` file per component

## Known Limitations & TODOs

- ⏳ Form components not yet implemented (awaiting design/validation logic)
- ⏳ Backend API not connected (mock-only)
- ⏳ No user authentication
- ⏳ No tests (Vitest planned)
- ⏳ AI Assistant responses are hardcoded
- 🐛 Minor CSS linter warnings in `ServiceCards.css` and `AIAssistant.css` (false positives)
