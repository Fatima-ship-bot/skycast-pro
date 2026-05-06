# SkyCast Pro Design System

## Overview
SkyCast Pro uses a premium glassmorphism design system with smooth animations, atmospheric gradients, and accessible components.

## Color Palette

### Primary Colors
- **Primary Blue**: HSL(212 95% 55%) - Main action color
- **Accent Coral**: HSL(25 95% 60%) - Secondary actions and highlights
- **Success Green**: HSL(152 76% 44%) - Positive states
- **Warning Orange**: HSL(38 92% 55%) - Warnings and alerts
- **Destructive Red**: HSL(0 84% 60%) - Critical actions/errors

### Neutral Colors
- **Background**: HSL(210 60% 98%) - Light mode
- **Dark Background**: HSL(230 35% 7%) - Dark mode
- **Foreground**: HSL(222 47% 11%) - Light mode text
- **Muted**: HSL(210 40% 95%) - Subtle elements

## Design Tokens

### Gradients
- `--gradient-aurora` - Multi-color vibrant gradient (primary action)
- `--gradient-day` - Bright blue sky gradient
- `--gradient-sunset` - Warm sunset colors
- `--gradient-rain` - Cool rainy tones
- `--gradient-storm` - Dark dramatic tones

### Shadows
- `shadow-glow` - Glowing effect for prominent elements
- `shadow-elegant` - Subtle depth shadow
- `shadow-card` - Light card shadow
- `shadow-glass` - Glass surface shadow

### Transitions
- Smooth: `cubic-bezier(0.4, 0, 0.2, 1)` - Default transitions
- Spring: `cubic-bezier(0.34, 1.56, 0.64, 1)` - Bouncy animations

## Component Classes

### Glass Surfaces
```html
<!-- Standard glass card -->
<div class="glass-card p-6">Content</div>

<!-- Stronger glass effect -->
<div class="glass-strong">Content</div>

<!-- Basic glass -->
<div class="glass">Content</div>
```

### Text Effects
```html
<!-- Gradient text -->
<h1 class="gradient-text">Heading</h1>

<!-- Text gradient -->
<p class="text-gradient">Colored text</p>
```

### Animations
```html
<!-- Float animation -->
<div class="animate-float-slow">Floating element</div>

<!-- Pulse glow -->
<div class="animate-pulse-glow">Glowing element</div>

<!-- Smooth transitions -->
<button class="transition-smooth hover:scale-105">Hover me</button>

<!-- Scale effect -->
<div class="hover-scale">Scales on hover</div>
```

### Background Effects
```html
<!-- Mesh background -->
<div class="mesh-bg">Content</div>

<!-- Shimmer loading state -->
<div class="shimmer h-20 rounded-lg"></div>
```

## Typography

### Font Families
- **Display**: Space Grotesk (headings, prominent text)
- **Body**: Inter (body text, UI labels)
- **Monospace**: JetBrains Mono (code, numbers)

### Heading Styles
```html
<!-- Large heading -->
<h1 class="font-display text-4xl md:text-6xl font-bold">Heading</h1>

<!-- Medium heading -->
<h2 class="font-display text-2xl font-semibold">Subheading</h2>

<!-- Text utilities -->
<p class="prose-lg">Large paragraph text</p>
<p class="prose-base">Normal paragraph text</p>
<p class="prose-sm">Small paragraph text</p>
```

## Animation Guidelines

### Performance Considerations
1. Use CSS animations for simple transitions (faster)
2. Use Framer Motion for complex sequences
3. Avoid animating expensive properties (size, position)
4. Use `will-change` for animation optimization

### Animation Timing
- **Fast**: 150ms - Micro interactions, hovers
- **Normal**: 300-400ms - Standard transitions
- **Slow**: 500-800ms - Page/section transitions
- **Very Slow**: 1000ms+ - Entrance animations

## Responsive Design

### Breakpoints
- **sm**: 640px - Small devices
- **md**: 768px - Tablets
- **lg**: 1024px - Desktops
- **xl**: 1280px - Large screens

### Mobile-First Approach
```html
<!-- Default: mobile -->
<div class="text-base md:text-lg lg:text-xl">Responsive text</div>

<!-- Visibility -->
<div class="hidden md:block">Visible on md+</div>
<div class="md:hidden">Hidden on md+</div>
```

## Accessibility Features

### Focus States
```html
<!-- Keyboard navigation ring -->
<button class="focus-ring">Accessible button</button>
```

### Color Contrast
- All text meets WCAG AA standards (4.5:1 for normal text)
- Interactive elements have clear focus indicators
- Status messages use more than color alone

### Semantic HTML
- Use proper heading hierarchy (h1, h2, h3)
- Use semantic elements (nav, main, article, section)
- Include ARIA labels where needed

## Theme Support

### Light Theme (Default)
- Bright, clear backgrounds
- High contrast text
- Sky-inspired colors

### Dark Theme
- Deep, atmospheric backgrounds
- Reduced eye strain
- Enhanced glow effects

### Switching Themes
```typescript
import { useSettings } from '@/context/SettingsContext';

export function Component() {
  const { theme, setTheme } = useSettings();
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle theme
    </button>
  );
}
```

## Component Examples

### Buttons
```html
<!-- Primary button -->
<button class="btn-primary px-6 py-2">Action</button>

<!-- Secondary button -->
<button class="btn-secondary px-6 py-2">Secondary</button>

<!-- Outline button -->
<button class="btn-outline px-6 py-2">Outline</button>
```

### Cards
```html
<div class="glass-card p-6 rounded-2xl">
  <h3 class="font-display font-semibold">Card Title</h3>
  <p class="text-muted-foreground mt-2">Card content</p>
</div>
```

### Badges
```html
<span class="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
  Badge
</span>
```

## Best Practices

1. **Consistency**: Use design tokens for colors and spacing
2. **Contrast**: Ensure readability with sufficient contrast
3. **Performance**: Minimize animations on lower-end devices
4. **Accessibility**: Always include keyboard navigation and focus states
5. **Responsiveness**: Test on multiple screen sizes
6. **Loading States**: Use shimmer or skeleton screens during loading
7. **Feedback**: Provide clear visual feedback for user interactions

## Future Enhancements

- CSS containment for better performance
- CSS Grid for complex layouts
- Custom property inheritance optimization
- Advanced animation presets
- Design tokens export for consistency
