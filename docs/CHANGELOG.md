# Changelog

## [1.0.0] - 2025-10-07

### ✨ Features

#### Product Carousels
- Dynamic product carousel system with shadcn/ui components
- Responsive design (mobile, tablet, desktop)
- Smooth navigation with arrow controls
- Hover effects on product cards
- Click-through to product pages

#### Data Management
- **Automatic environment detection**
  - Development: Uses local JSON data (`Data/homeFeedData.json`)
  - Production: Fetches from API
- Configurable via environment variables or config file
- JSON-based product structure with title, description, price, image, and route

#### UI States
- **Loading State**: Animated skeleton placeholders
- **Success State**: Product carousels with images and details
- **Error State**: Red alert with retry button (no fallback)
- **Empty State**: Clean message when no products available

#### Components Created
- `ProductCarousel.tsx` - Main carousel component
- `CarouselSkeleton.tsx` - Loading skeleton
- `EmptyState.tsx` - Error and empty states with retry functionality
- `Header.tsx` - Navigation header
- Various shadcn/ui components (Card, Carousel, Button, Skeleton, Navigation Menu)

### 🔧 Configuration

#### Automatic Environment Detection
```typescript
// config/app.config.ts
- Detects NODE_ENV automatically
- Development → local data
- Production → API
- Override with NEXT_PUBLIC_USE_LOCAL_DATA
```

#### API Configuration
```env
NEXT_PUBLIC_API_URL=https://your-api.com
NEXT_PUBLIC_USE_LOCAL_DATA=false (optional)
```

### 🎨 Design

- Borderless product cards
- Tall product images (h-80)
- Narrow card width (280px-320px)
- Minimal spacing between elements
- Full-width carousels
- Consistent spacing and typography

### 📦 Data Structure

**Local Fallback**: `Data/homeFeedData.json`
```json
{
  "carousels": [
    {
      "title": "Featured Products",
      "products": [...] 
    },
    {
      "title": "New Arrivals",
      "products": [...]
    }
  ]
}
```

Each product contains:
- `id`: Unique identifier
- `title`: Product name
- `description`: Product description
- `value`: Price
- `image`: Picsum placeholder URL
- `route`: Product page route

### 🚨 Error Handling

**Production Behavior:**
- API failure → Shows error state (no fallback to local data)
- Provides "Try Again" button for retry
- Clear error messaging to users

**Development Behavior:**
- Always uses local data
- No API calls
- No error states

### 📝 Documentation

Created comprehensive documentation:
- `README.md` - Main project documentation
- `docs/DEPLOY.md` - Deployment guide with examples
- `docs/CONFIG.md` - Configuration details
- `docs/CHANGELOG.md` - This file

### 🛠️ Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Embla Carousel
- React 19

### 🎯 Key Decisions

1. **No automatic fallback in production**
   - Better to show clear error than stale data
   - Provides retry mechanism

2. **Automatic environment detection**
   - No manual configuration needed for dev/prod
   - Can be overridden if necessary

3. **Dynamic carousel generation**
   - Automatically creates carousels from JSON structure
   - Easy to add/remove carousel sections

4. **Picsum for placeholder images**
   - Configured in `next.config.ts`
   - Random, good-looking product images

### 📊 Performance

- Image optimization via Next.js Image component
- Skeleton loading for better perceived performance
- Client-side rendering for dynamic data
- Minimal re-renders with proper React patterns

