# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**"나의 버킷 리스트" (My Bucket List)** is a vanilla JavaScript web application for recording and managing life goals. It's a simple, single-page application with no build tools, frameworks, or backend services.

- **Tech Stack**: HTML5, CSS3, JavaScript (ES6+), Tailwind CSS (CDN), LocalStorage API
- **Architecture**: Vanilla JS with modular design (no React/Vue/etc.)
- **Deployment**: Static files only - runs directly in browser with no server needed

## Running & Development

### Opening the Project
```bash
# Option 1: Direct browser open
# Double-click index.html or drag to browser

# Option 2: Python local server (recommended for development)
python -m http.server 8000
# Then visit http://localhost:8000

# Option 3: Live Server (VS Code)
# Right-click index.html → "Open with Live Server"
```

### No Build/Test/Lint Process
This project has **no build process, tests, or linting**. It's intentionally simple:
- Files are served directly to browser
- JavaScript is not transpiled or bundled
- HTML/CSS/JS changes take effect on page refresh
- No dependencies to install

## Architecture

### Modular Design Pattern
The application uses **two independent modules**:

1. **`js/storage.js` - Data Layer (BucketStorage object)**
   - Single responsibility: LocalStorage data management
   - All CRUD operations go through this module
   - Stateless - loads/saves complete dataset on each operation
   - Methods: `load()`, `save()`, `addItem()`, `updateItem()`, `deleteItem()`, `toggleComplete()`, `getStats()`, `getFilteredList()`
   - Data shape: `{ id, title, completed, createdAt, completedAt }`

2. **`js/app.js` - UI Layer (BucketListApp class)**
   - Manages all user interactions and DOM updates
   - Calls `BucketStorage` for any data changes
   - Properties: `currentFilter`, `editingId` for state
   - Key methods: `handleAdd()`, `handleFilter()`, `handleToggle()`, `handleDelete()`, `openEditModal()`, `render()`
   - Re-renders entire UI after any data change (simple, not optimized, but sufficient for this app)

### Data Flow
```
User Action → App Event Handler → BucketStorage Method → localStorage → render() → UI Update
```

### Important: Re-render Pattern
The app uses a **full re-render approach**: after any state change (add/edit/delete/filter), `render()` regenerates the entire list HTML. This is simple but less performant than virtual DOM updates. Fine for this small app, but flag as optimization point if adding significant features.

## Code Organization

### File Structure
```
index.html       # Single HTML file - all UI markup here
css/styles.css   # Custom CSS + animations (Tailwind supplements)
js/storage.js    # BucketStorage object (data management)
js/app.js        # BucketListApp class (UI control)
```

### Key Implementation Details

#### Data Structure
Items use **timestamp-based IDs** (`Date.now().toString()`). This is simple and works for this use case but won't scale to multiple users.

#### LocalStorage Strategy
- Single storage key: `'bucketList'`
- Complete dataset loaded/saved on every operation
- No partial updates - this keeps logic simple
- Size limit ~5-10MB (varies by browser)

#### Dates
- Stored as ISO strings (`new Date().toISOString()`)
- Displayed using locale-specific format (`toLocaleDateString('ko-KR')`)
- `completedAt` is `null` for incomplete items, set on completion

#### XSS Prevention
The app **escapes HTML in user input**:
```javascript
escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;  // textContent sets plain text
    return div.innerHTML;      // reading innerHTML returns escaped HTML
}
```
Use this for any user-controlled text rendered in HTML. It's already used in `createBucketItemHTML()` and for edit modal.

#### Event Handling
- No event delegation - events are bound directly to specific elements (simpler for small app)
- Modal closes on backdrop click via `if (e.target === this.editModal)`
- Delete confirmation uses native `confirm()` dialog

## Development Guidelines

### Adding New Features
1. **Data change?** Add method to `BucketStorage`
2. **UI event?** Add handler method to `BucketListApp`
3. **New UI elements?** Add to `index.html`, cache in `cacheElements()`, bind in `bindEvents()`
4. **Always call `render()`** after any state change to update UI

### Updating HTML Structure
- Keep `id` attributes consistent (app references them by ID)
- Filter buttons must have `data-filter` attribute
- Action buttons inline event handlers that call `app.handleX()` methods

### LocalStorage Debugging
```javascript
// In browser console:
localStorage.getItem('bucketList')  // View raw JSON
localStorage.clear()                 // Clear all data
```

### Styling Approach
- Primary framework: **Tailwind CSS** (CDN) for utility classes
- Supplementary: `css/styles.css` for custom CSS + animations
- Theme colors: Blue primary (#3b82f6), Green success (#10b981), Red danger (#dc2626)
- Animations: Defined in `styles.css` (slideIn, fadeIn, scaleIn)

### Responsive Breakpoints
- Mobile: ≤640px (column layout for bucket items, adjusted buttons)
- Tablet: 641px-1023px (flexible)
- Desktop: ≥1024px (full width layout)
- Media query override in `styles.css` handles mobile adjustments

### Browser Compatibility
Works in all modern browsers that support:
- LocalStorage API
- ES6 classes
- `const`/`let` declarations
- Template literals
- Arrow functions

No IE11 support intended.

## Common Modifications

### Change Color Theme
Edit Tailwind classes in `index.html`:
```html
<!-- From blue to purple: -->
<!-- Change bg-blue-600 hover:bg-blue-700 to bg-purple-600 hover:bg-purple-700 -->
```

### Add New Filter Type
1. Add button to `index.html` with `data-filter="newType"`
2. Update `BucketStorage.getFilteredList()` switch statement
3. App already handles filter changes generically

### Add Persistence Features (future)
If considering IndexedDB, backend API, etc.:
- Keep `BucketStorage` as abstraction layer
- Only change internals of `load()` and `save()`
- App code doesn't change

### Add Form Validation
- `handleAdd()` already checks for empty input
- `handleEditSubmit()` does the same
- Add validation before calling storage methods

## Important Notes for Future Development

1. **No Tests**: This is intentional for a simple app. If adding major features, consider adding basic smoke tests.

2. **Single User**: IDs are based on `Date.now()`. Fine for single-user browser app, but won't work if synced across devices/users.

3. **Performance**: Full re-render works fine now, but if list grows to 1000+ items, consider optimizing to update only changed items.

4. **Mobile UX**: The app is responsive but uses confirm() for deletion - consider a modal confirmation for better mobile feel if updating UX.

5. **Accessibility**: Basic accessibility is in place (semantic HTML, keyboard support), but not fully WCAG compliant. Flag if this becomes a requirement.

6. **Security**: LocalStorage is domain-specific, so XSS is the main risk (already mitigated). No sensitive data should be stored.

## Related Files

- **README.md**: User-facing documentation (install methods, usage guide, feature list)
- **index.html**: Structure, layout, form elements
- **js/storage.js**: All data operations (independent of UI)
- **js/app.js**: All UI operations (depends on storage)
- **css/styles.css**: Animations, responsive adjustments, custom styles
