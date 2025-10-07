# 🛍️ Página de Produto

Documentação da página de produto com layout split-screen.

## 📐 Layout

### Desktop (lg+)
```
┌─────────────────────────────────────────────────────┐
│                    HEADER (fixed)                    │
├──────────────────────┬──────────────────────────────┤
│                      │                              │
│                      │  Category                    │
│      MEDIA           │  Title (Large)               │
│   (Image/Video)      │  Price                       │
│                      │  Description                 │
│                      │                              │
│                      │  Features                    │
│                      │  - Item 1                    │
│                      │  - Item 2                    │
│                      │                              │
│                      │  Specifications              │
│                      │  Brand: XXX                  │
│                      │  Model: XXX                  │
│                      │                              │
│                      │  [Add to Cart] [♥]          │
│                      │  ✓ In Stock                  │
│                      │                              │
├──────────────────────┴──────────────────────────────┤
│                       FOOTER                         │
└─────────────────────────────────────────────────────┘
```

### Mobile (< lg)
```
┌─────────────────────┐
│       HEADER        │
├─────────────────────┤
│                     │
│       MEDIA         │
│   (Image/Video)     │
│                     │
├─────────────────────┤
│  Category           │
│  Title              │
│  Price              │
│  Description        │
│                     │
│  Features           │
│  Specifications     │
│                     │
│  [Add to Cart] [♥] │
│  ✓ In Stock         │
├─────────────────────┤
│       FOOTER        │
└─────────────────────┘
```

---

## 📋 JSON Structure

### Endpoint
```
GET /products/:id
```

### Response Schema

```json
{
  "id": number,
  "title": string,
  "description": string,
  "price": number,
  "currency": string,
  "media": {
    "type": "image" | "video",
    "url": string,
    "alt": string
  },
  "features": string[],
  "specifications": {
    [key: string]: string
  },
  "stock": boolean,
  "category": string
}
```

### Example Response

```json
{
  "id": 1,
  "title": "Premium Wireless Headphones",
  "description": "Experience superior sound quality...",
  "price": 299.99,
  "currency": "USD",
  "media": {
    "type": "image",
    "url": "https://example.com/product.jpg",
    "alt": "Premium Wireless Headphones"
  },
  "features": [
    "Active Noise Cancellation",
    "30-hour battery life",
    "Premium comfort cushions"
  ],
  "specifications": {
    "Brand": "Premium Audio",
    "Model": "PH-3000",
    "Color": "Matte Black"
  },
  "stock": true,
  "category": "Electronics"
}
```

---

## 🎨 Features

### Media Support
- ✅ **Images** - JPG, PNG, WebP
- ✅ **Videos** - MP4 (autoplay, loop, muted)
- ✅ Responsive sizing
- ✅ Object-fit contain

### Content Sections
1. **Header Info**
   - Category (small, uppercase)
   - Product title (large, bold)
   - Price with currency

2. **Description**
   - Full product description
   - Lead-in paragraph style

3. **Features** (Optional)
   - Bulleted list with checkmarks
   - Key selling points

4. **Specifications** (Optional)
   - Grid layout (2 columns)
   - Key-value pairs

5. **Actions**
   - Add to Cart button (disabled if out of stock)
   - Favorite/Wishlist button
   - Stock status indicator

---

## 🎯 Usage

### Accessing Product Page

```
/product/[id]
```

Examples:
- `/product/1` - Product with ID 1
- `/product/123` - Product with ID 123

### From Product Carousel

Update `ProductCarousel.tsx` links:

```tsx
<Link href={`/product/${product.id}`}>
  {/* Product Card */}
</Link>
```

---

## 🔧 Configuration

### Local Development

Uses fallback data from `Data/productData.json`

### Production

Fetches from API: `${API_URL}/products/:id`

### Environment Variables

```env
# API URL
NEXT_PUBLIC_API_URL=https://api.example.com

# Force local data
NEXT_PUBLIC_USE_LOCAL_DATA=true
```

---

## 🎨 Styling

### Media Section
```tsx
className="relative bg-muted flex items-center justify-center p-8 lg:p-12"
```

- Background: `bg-muted` (light gray)
- Padding: Responsive (8 → 12)
- Image: `object-contain` (no cropping)
- Max height: `80vh`

### Content Section
```tsx
className="flex flex-col justify-center p-8 lg:p-16 max-w-2xl"
```

- Centered vertically
- Padding: Responsive (8 → 16)
- Max width: `2xl` (672px)

---

## 📱 Responsive Behavior

### Breakpoints

- **Mobile** (< 1024px): Stacked layout (media on top)
- **Desktop** (≥ 1024px): Split layout (50/50)

### Grid Configuration

```tsx
className="grid grid-cols-1 lg:grid-cols-2"
```

---

## 🎬 Media Types

### Image
```json
{
  "media": {
    "type": "image",
    "url": "https://example.com/image.jpg",
    "alt": "Product image"
  }
}
```

### Video
```json
{
  "media": {
    "type": "video",
    "url": "https://example.com/video.mp4",
    "alt": "Product video"
  }
}
```

**Video Attributes:**
- `autoPlay` - Starts automatically
- `loop` - Loops infinitely
- `muted` - No sound
- `playsInline` - Plays inline on mobile

---

## 🔄 States

### Loading
```tsx
<div className="animate-pulse text-lg">Loading...</div>
```

### Not Found
```tsx
<div className="text-center">
  <h1>Product not found</h1>
  <p>The product you're looking for doesn't exist.</p>
</div>
```

### Loaded
- Full product display
- All features visible

---

## 🛒 Actions

### Add to Cart Button

```tsx
<Button size="lg" className="flex-1" disabled={!product.stock}>
  {product.stock ? "Add to Cart" : "Out of Stock"}
</Button>
```

- **In Stock**: Enabled, primary color
- **Out of Stock**: Disabled, grayed out

### Favorite Button

```tsx
<Button size="lg" variant="outline">
  <HeartIcon />
</Button>
```

- Icon-only button
- Outline variant

### Stock Indicator

```tsx
{product.stock && (
  <p className="text-sm text-green-600">
    ✓ In Stock - Ships within 24 hours
  </p>
)}
```

---

## 📝 Example Products

### Product 1 - Headphones
```
/product/1
```
File: `Data/products/product-1.json`

### Product 2 - Backpack
```
/product/2
```
File: `Data/products/product-2.json`

---

## 🚀 Integration

### Update Product Links

In `ProductCarousel.tsx`:

```tsx
<Link href={`/product/${product.id}`}>
  <Card>
    {/* Product card content */}
  </Card>
</Link>
```

In `homeFeedData.json`:

```json
{
  "id": 1,
  "title": "Product Name",
  "route": "/product/1"  // Use product ID
}
```

---

## 🎯 Best Practices

### Images
- **Size**: 800x1000px (portrait)
- **Format**: WebP for best compression
- **Alt text**: Descriptive for accessibility

### Videos
- **Size**: Max 5MB
- **Duration**: 10-30 seconds
- **Format**: MP4 (best compatibility)

### Description
- **Length**: 2-3 sentences
- **Focus**: Key benefits
- **Tone**: Conversational

### Features
- **Count**: 4-6 items
- **Style**: Short, punchy statements
- **Order**: Most important first

### Specifications
- **Keys**: Clear, consistent naming
- **Values**: Concise, accurate
- **Count**: 5-8 items max

---

## 📚 Related Documentation

- [API_ENDPOINTS.md](./API_ENDPOINTS.md) - API integration
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Data loading patterns
- [CONFIG.md](./CONFIG.md) - Environment configuration

---

**File:** `app/product/[id]/page.tsx`  
**Data:** `Data/productData.json`  
**Última atualização:** Outubro 2025
