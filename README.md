# Placebo Webpage

E-commerce webpage built with Next.js, TypeScript, and shadcn/ui components featuring dynamic product carousels.

## ✨ Features

- 🎨 **Hero Section** - Full-screen hero with image/video support
- 🔄 **Dynamic Product Carousels** - Multiple carousels from API/JSON
- 📱 **Fully Responsive** - Mobile-first design
- ⚡ **Fast Loading** - Skeleton states and optimized images
- 🌐 **API Integration** - Automatic environment detection
- 🎯 **TypeScript** - Full type safety
- 🔍 **Search Overlay** - Modal search experience
- 🎛️ **Backend Controlled** - Hero can be enabled/disabled remotely
- 🚀 **Production Ready** - Error handling and retry logic

## 🚀 Quick Start

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - the app will automatically use local test data.

### Production Build

```bash
npm run build
npm start
```

The app will fetch data from the configured API.

## 📁 Project Structure

```
placebo-webpage/
├── app/                      # Next.js app directory
│   ├── page.tsx             # Home page (Hero + Carousels)
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/               # React components
│   ├── Hero.tsx             # Hero section (image/video)
│   ├── ProductCarousel.tsx  # Product carousel
│   ├── CarouselSkeleton.tsx # Loading state
│   ├── EmptyState.tsx       # Error/empty states
│   ├── SearchOverlay.tsx    # Search modal
│   ├── header/              # Header component
│   ├── footer/              # Footer component
│   └── ui/                  # shadcn/ui components
├── config/                   # App configuration
│   └── app.config.ts        # Environment detection & API config
├── Data/                     # Local test data (fallback)
│   ├── heroData.json        # Hero configuration
│   ├── homeFeedData.json    # Product carousels
│   └── headerData.json      # Navigation data
└── docs/                     # Documentation
    ├── README.md            # Documentation index
    ├── HERO_CONFIG.md       # Hero configuration guide
    ├── API_ENDPOINTS.md     # API documentation
    ├── CONFIG.md            # Configuration guide
    ├── DEPLOY.md            # Deployment guide
    └── CHANGELOG.md         # Version history
```

## 🔧 Configuration

The app automatically detects the environment:

- **Development** (`npm run dev`) → Uses local JSON data
- **Production** (`npm run build`) → Fetches from API

### Environment Variables

For production, configure:

```env
NEXT_PUBLIC_API_URL=https://your-api.com
```

See [docs/CONFIG.md](docs/CONFIG.md) for detailed configuration options.

## 📊 Data Management

### Development (Automatic)
Uses local test data from JSON files. No configuration needed:
- `Data/heroData.json` - Hero configuration
- `Data/homeFeedData.json` - Product carousels

### Production (Automatic)
Fetches from API endpoints:
- `{API_URL}/hero` - Hero configuration
- `{API_URL}/carousels` - Product carousels

**Example API Responses:**

<details>
<summary>Hero Endpoint</summary>

```json
{
  "enabled": true,
  "mediaType": "image",
  "mediaSrc": "https://cdn.example.com/hero.jpg",
  "overlayOpacity": 40,
  "content": {
    "title": "Placebo",
    "subtitle": "Descubra o estilo que define você",
    "buttons": [
      {
        "text": "Ver Novidades",
        "href": "/novidades",
        "variant": "primary"
      }
    ]
  },
  "showScrollIndicator": true
}
```
</details>

<details>
<summary>Carousels Endpoint</summary>

```json
{
  "carousels": [
    {
      "title": "Featured Products",
      "products": [
        {
          "id": 1,
          "title": "Product Name",
          "description": "Product description",
          "value": 99.99,
          "image": "https://...",
          "route": "/products/..."
        }
      ]
    }
  ]
}
```
</details>

See [docs/API_ENDPOINTS.md](docs/API_ENDPOINTS.md) for complete API documentation.

## 🎨 UI States

The app handles 4 different states:

1. **Loading** - Animated skeleton placeholders
2. **Success** - Product carousels with navigation
3. **Error** - Error message with retry button
4. **Empty** - No products available message

## 🚀 Deployment

See [docs/DEPLOY.md](docs/DEPLOY.md) for complete deployment instructions.

**Quick Deploy (Vercel):**
1. Push to GitHub
2. Connect to Vercel
3. Set `NEXT_PUBLIC_API_URL` environment variable
4. Deploy! ✨

## 🛠️ Tech Stack

- [Next.js 15](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Embla Carousel](https://www.embla-carousel.com/) - Carousel functionality

## 📚 Documentation

### 📖 Main Docs
- [**Documentation Index**](docs/README.md) - Complete documentation hub
- [**Hero Configuration**](docs/HERO_CONFIG.md) - Hero setup (image/video, enable/disable)
- [**API Endpoints**](docs/API_ENDPOINTS.md) - Backend integration guide
- [**Architecture**](docs/ARCHITECTURE.md) - Independent data loading architecture

### ⚙️ Configuration & Deploy
- [**Configuration Guide**](docs/CONFIG.md) - Environment and API setup
- [**Deployment Guide**](docs/DEPLOY.md) - How to deploy to production
- [**Changelog**](docs/CHANGELOG.md) - Version history and updates

### 🎯 Quick Links
- **Hero Setup:** [docs/HERO_CONFIG.md](docs/HERO_CONFIG.md)
- **API Integration:** [docs/API_ENDPOINTS.md](docs/API_ENDPOINTS.md)
- **Environment Config:** [docs/CONFIG.md](docs/CONFIG.md)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
