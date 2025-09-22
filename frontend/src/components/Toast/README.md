# MerakiNexus Toast System

A beautiful, customizable toast notification system built with React, GSAP, and Tailwind CSS. Features the MerakiNexus design theme with gradient backgrounds, blur effects, and smooth animations.

## Features

- 🎨 **MerakiNexus Theme**: Gradient backgrounds, backdrop blur, rounded corners
- ✨ **GSAP Animations**: Smooth slide-in/out animations with scale effects
- 🎯 **Multiple Types**: Success, Error, Info notifications
- 📱 **Responsive**: Works on all screen sizes
- 🔧 **Customizable**: Duration, positioning, styling
- 📚 **Stacking**: Multiple toasts stack neatly without overlap
- 🎛️ **Easy API**: Simple hook-based usage
- 🚀 **Performance**: Optimized animations and rendering

## Installation & Setup

The Toast system is already integrated into the MerakiNexus application. It's wrapped around the entire app in `App.jsx`:

```jsx
import { ToastProvider } from "./components/Toast";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>{/* Your app content */}</ToastProvider>
    </AuthProvider>
  );
}
```

## Basic Usage

```jsx
import { useToast } from "../components/Toast";

const MyComponent = () => {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success("Operation completed successfully!");
  };

  const handleError = () => {
    toast.error("Something went wrong!");
  };

  const handleInfo = () => {
    toast.info("Here's some information.");
  };

  return (
    <div>
      <button onClick={handleSuccess}>Success</button>
      <button onClick={handleError}>Error</button>
      <button onClick={handleInfo}>Info</button>
    </div>
  );
};
```

## API Reference

### `useToast()` Hook

Returns an object with the following methods:

#### Basic Methods

- `toast.success(message, duration?)` - Show success notification
- `toast.error(message, duration?)` - Show error notification
- `toast.info(message, duration?)` - Show info notification
- `toast.show(message, type, duration?)` - Generic show method

#### Advanced Methods

- `toast.remove(id)` - Remove specific toast by ID
- `toast.clear()` - Remove all toasts
- `toast.count` - Get current number of toasts
- `toast.toasts` - Get array of current toasts

### Parameters

- **message** (string): The text to display
- **duration** (number, optional): Auto-dismiss time in milliseconds
  - Success/Info: 4000ms (4 seconds) default
  - Error: 5000ms (5 seconds) default
  - Set to 0 for manual dismiss only
- **type** (string): "success" | "error" | "info"

## Examples

### Custom Duration

```jsx
// Show for 8 seconds
toast.success("Long message", 8000);

// Manual dismiss only
toast.error("Critical error", 0);
```

### Multiple Toasts

```jsx
const showMultiple = () => {
  toast.success("First message");
  setTimeout(() => toast.error("Second message"), 500);
  setTimeout(() => toast.info("Third message"), 1000);
};
```

### Clearing Toasts

```jsx
// Clear all toasts
toast.clear();

// Remove specific toast (if you stored the ID)
const id = toast.success("My message");
toast.remove(id);
```

## Styling & Theme

The toasts use the MerakiNexus design system:

### Colors

- **Success**: Purple to blue gradient (`from-purple-500/90 to-blue-500/90`)
- **Error**: Red gradient (`from-red-500/90 to-red-600/90`)
- **Info**: Blue gradient (`from-blue-500/90 to-blue-600/90`)

### Design Features

- Semi-transparent backgrounds with backdrop blur
- Rounded corners (12px)
- Subtle shadows with purple glow
- White text with icons from Lucide React
- Progress bar showing remaining time

### Animations (GSAP)

- **Entrance**: Slide from right, fade-in, scale-up (400ms)
- **Exit**: Slide to right, fade-out, scale-down (300ms)
- **Stacking**: Automatic positioning with 80px spacing

## Components

### Files Structure

```
src/components/Toast/
├── Toast.jsx          # Individual toast component
├── ToastContext.jsx   # Context provider
├── useToast.js        # Hook for easy usage
├── ToastDemo.jsx      # Demo component
├── index.js           # Clean exports
└── README.md          # This documentation
```

### Toast Component Props

```jsx
<Toast
  id="unique-id"
  message="Your message"
  type="success" // "success" | "error" | "info"
  duration={4000}
  index={0} // For stacking position
  onClose={handleClose}
/>
```

## Demo Component

A demo component is available for testing:

```jsx
import ToastDemo from "../components/Toast/ToastDemo";

// Use in your component or page for testing
<ToastDemo />;
```

## Migration from Old Toast

If migrating from the old custom toast implementations:

### Before

```jsx
const [toast, setToast] = useState(null);

const showToast = (message, type = "success") => {
  setToast({ message, type });
  setTimeout(() => setToast(null), 4000);
};

// Usage
showToast("Success message!");
showToast("Error message", "error");
```

### After

```jsx
const toast = useToast();

// Usage
toast.success("Success message!");
toast.error("Error message");
```

## Browser Support

- ✅ Chrome/Edge 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Notes

- Toasts are rendered only when active
- GSAP animations are hardware-accelerated
- Automatic cleanup prevents memory leaks
- Context optimized to prevent unnecessary re-renders

## Troubleshooting

### Common Issues

1. **"useToast must be used within a ToastProvider"**

   - Ensure ToastProvider wraps your component tree

2. **Animations not working**

   - Verify GSAP is installed: `npm list gsap`
   - Check for CSS conflicts with transforms

3. **Toasts not showing**

   - Check z-index conflicts (toasts use `z-[9999]`)
   - Verify ToastProvider is properly imported

4. **Styling issues**
   - Ensure Tailwind CSS is configured
   - Check for CSS purging removing needed classes

---

Built with ❤️ for MerakiNexus
