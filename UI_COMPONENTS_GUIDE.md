# 🎨 CodeVerse UI Component Library - Quick Reference

## Utility Classes

### Buttons
```jsx
// Primary Button (Gradient with shimmer)
<button className="btn-primary">
  Click Me
</button>

// Secondary Button (Dark with border)
<button className="btn-secondary">
  Cancel
</button>

// Custom Gradient Button
<button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-glow-sm hover:scale-105 active:scale-95">
  Custom Button
</button>
```

### Inputs
```jsx
// Standard Input
<input className="input-field" placeholder="Enter text..." />

// Input with Icon
<div className="relative">
  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
  <input className="input-field pl-12" placeholder="Email..." />
</div>
```

### Cards
```jsx
// Standard Card
<div className="card">
  <h3 className="text-lg font-semibold text-white mb-2">Card Title</h3>
  <p className="text-gray-400">Card content goes here</p>
</div>

// Card with Gradient Overlay
<div className="card group relative">
  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
  <div className="relative z-10">
    {/* Content */}
  </div>
</div>
```

### Glass Effect
```jsx
<div className="glass-effect border border-dark-border/50 rounded-2xl p-6">
  Glass morphism content
</div>
```

### Text Gradients
```jsx
<h1 className="text-gradient text-4xl font-bold">
  Gradient Text
</h1>

// Or custom gradient
<h1 className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
  Custom Gradient
</h1>
```

---

## Animations

### Fade In
```jsx
<div className="animate-fade-in">
  Content fades in
</div>
```

### Slide Up
```jsx
<div className="animate-slide-up">
  Content slides up from bottom
</div>
```

### Scale In
```jsx
<div className="animate-scale-in">
  Content scales in (great for modals)
</div>
```

### Staggered Animations
```jsx
{items.map((item, index) => (
  <div 
    key={item.id}
    style={{ animationDelay: `${index * 0.1}s` }}
    className="animate-slide-up"
  >
    {item.content}
  </div>
))}
```

---

## Icons with Animations

### Hover Translate
```jsx
<ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
```

### Hover Rotate
```jsx
<Plus className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
```

### Hover Scale
```jsx
<Share2 className="w-5 h-5 transition-transform group-hover:scale-110" />
```

### Pulse Animation
```jsx
<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
```

---

## Loading States

### Spinner
```jsx
<div className="relative">
  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
  <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border border-blue-500 opacity-20"></div>
</div>
```

### Loading Button
```jsx
<button disabled className="btn-primary">
  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
  Loading...
</button>
```

---

## Backgrounds

### Gradient Background
```jsx
<div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
```

### Radial Gradient
```jsx
<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] animate-pulse"></div>
```

### Combined Background Effect
```jsx
<div className="relative">
  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
  <div className="relative z-10">
    {/* Content */}
  </div>
</div>
```

---

## Status Indicators

### Online Status
```jsx
<div className="flex items-center gap-2">
  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
  <span className="text-sm text-gray-300">Online</span>
</div>
```

### Badge
```jsx
<div className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-lg">
  <span className="text-xs font-medium text-blue-400">Badge</span>
</div>
```

---

## Modals

### Premium Modal
```jsx
{showModal && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
    <div className="bg-dark-card border border-dark-border rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scale-in">
      <h2 className="text-2xl font-bold text-white mb-4">Modal Title</h2>
      {/* Modal content */}
    </div>
  </div>
)}
```

---

## Toggle Switch

### Custom Toggle
```jsx
<label className="flex items-center gap-3 cursor-pointer">
  <div className="relative">
    <input
      type="checkbox"
      checked={isEnabled}
      onChange={(e) => setIsEnabled(e.target.checked)}
      className="sr-only peer"
    />
    <div className="w-11 h-6 bg-dark-surface rounded-full peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-500 transition-all"></div>
    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
  </div>
  <span className="text-sm font-medium text-gray-300">Toggle Label</span>
</label>
```

---

## Color Palette

### Background Colors
- `bg-dark-bg` - Main background (#0a0e14)
- `bg-dark-surface` - Surface level (#0f1419)
- `bg-dark-card` - Card background (#151a21)
- `bg-dark-hover` - Hover state (#1a1f2e)

### Border Colors
- `border-dark-border` - Standard border (#1f2937)

### Accent Colors
- `text-blue-400`, `bg-blue-500`, `from-blue-600`
- `text-purple-400`, `bg-purple-500`, `from-purple-600`
- `text-pink-400`, `bg-pink-500`, `from-pink-600`

### Semantic Colors
- Success: `text-green-400`, `bg-green-500`
- Error: `text-red-400`, `bg-red-500`
- Warning: `text-yellow-400`, `bg-yellow-500`
- Info: `text-blue-400`, `bg-blue-500`

---

## Shadows

### Card Shadow
```jsx
<div className="shadow-card">Card with shadow</div>
```

### Glow Effects
```jsx
<button className="shadow-glow-sm hover:shadow-glow-md">
  Glowing Button
</button>
```

---

## Responsive Classes

### Hide on Mobile
```jsx
<span className="hidden sm:inline">Desktop only</span>
```

### Show on Mobile
```jsx
<span className="sm:hidden">Mobile only</span>
```

### Responsive Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Grid items */}
</div>
```

---

## Best Practices

1. **Always use transitions**: Add `transition-all duration-300` for smooth effects
2. **Group hover states**: Use `group` and `group-hover:` for parent-child interactions
3. **Combine animations**: Layer multiple effects for rich interactions
4. **Use relative positioning**: For absolute positioned overlays
5. **Add z-index**: When layering elements (z-10, z-20, z-50)
6. **Consistent spacing**: Use Tailwind's spacing scale (4, 6, 8, 12, 16)
7. **Semantic colors**: Use appropriate colors for actions (blue=primary, red=danger)
8. **Accessibility**: Always include focus states and proper contrast

---

## Common Patterns

### Button with Icon
```jsx
<button className="btn-primary group">
  <Icon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
  Button Text
</button>
```

### Card with Hover Effect
```jsx
<div className="card group hover:-translate-y-1">
  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
  <div className="relative z-10">
    {/* Content */}
  </div>
</div>
```

### Input with Focus Ring
```jsx
<input className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
```

---

## Performance Tips

1. Use `transform` and `opacity` for animations (GPU accelerated)
2. Avoid animating `width`, `height`, `top`, `left`
3. Use `will-change` sparingly for complex animations
4. Prefer CSS transitions over JavaScript animations
5. Use `backdrop-filter` carefully (can be expensive)

---

## Quick Copy-Paste Components

### Hero Section
```jsx
<div className="relative overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
  <div className="relative max-w-7xl mx-auto px-6 py-16">
    <h1 className="text-5xl font-bold text-white mb-4">Hero Title</h1>
    <p className="text-gray-400 text-lg">Hero description</p>
  </div>
</div>
```

### Empty State
```jsx
<div className="text-center py-32 animate-fade-in">
  <div className="relative inline-block mb-6">
    <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
    <Icon className="relative w-24 h-24 text-blue-500 mx-auto" />
  </div>
  <h3 className="text-2xl font-bold text-white mb-3">Empty State Title</h3>
  <p className="text-gray-400 text-lg mb-8">Empty state description</p>
</div>
```

This quick reference covers the most commonly used patterns in the CodeVerse premium UI!
