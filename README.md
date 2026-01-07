# 🚀 AppScreen Engine v5.0

Enterprise-grade App Store screenshot generator with AI-powered backgrounds, premium templates, and professional 4K batch export.

## ✨ Features

### 🎨 Visual Design System
- **25+ Premium Templates** - Curated designs for Fintech, SaaS, Luxury, Gaming, and more
- **Glassmorphism Effects** - Modern frosted glass aesthetic throughout
- **Dynamic Animations** - Smooth micro-animations and hover effects
- **Premium Color System** - Full control over primary, secondary, and accent colors

### ⚡ DIY Editor Features
- **Full Design Control** - Colors, backgrounds, shadows, and device transforms
- **Device Presets** - iPhone 16 Pro, iPhone 16 Pro Max, iPad Pro, Pixel 9 Pro
- **Text Alignment** - Left, center, right positioning with live preview
- **3D Transform Controls** - Tilt, rotation, and scale adjustments
- **Shadow Styles** - None, Soft, Heavy, Grounded, Floating options

### 🛠 Power User Features
- **Undo/Redo** - Full history support (Ctrl+Z / Ctrl+Y)
- **Keyboard Shortcuts** - Speed up your workflow with hotkeys
- **Frame Management** - Duplicate, delete, reorder frames
- **Zoom Controls** - Zoom in/out with percentage display
- **Drag & Drop** - Drop images directly onto frames

### 🤖 AI-Powered Features
- **One-Click Magic** - AI analyzes your UI and generates matching backgrounds
- **Brand Detection** - Automatic color palette extraction
- **Caption Suggestions** - AI-generated marketing headlines
- **Custom Scene Generation** - Text-to-image panoramic backgrounds

### 📦 Export Capabilities
- **4K Resolution** - Ultra-high quality exports (4x pixel ratio)
- **Batch Export** - Export all frames as a ZIP archive
- **Device-Specific** - Optimized for App Store requirements

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + Z` | Undo |
| `Ctrl + Y` | Redo |
| `Ctrl + D` | Duplicate selected frame |
| `Delete` | Delete selected frame |
| `←` / `→` | Move frame left/right |
| `Ctrl + E` | Export all frames |
| `Ctrl + +` | Zoom in |
| `Ctrl + -` | Zoom out |
| `Ctrl + 0` | Reset zoom |
| `?` | Toggle shortcuts panel |

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔧 Configuration

Create a `.env.local` file with your Google AI API key:

```
API_KEY=your_google_ai_api_key
```

## 📁 Project Structure

```
appscreen-engine/
├── components/
│   ├── DeviceFrame.tsx      # Frame component with device mockup
│   ├── Sidebar.tsx          # Design controls and templates
│   ├── Toast.tsx            # Notification system
│   ├── QuickActions.tsx     # Frame action toolbar
│   ├── ZoomControls.tsx     # Zoom in/out controls
│   ├── KeyboardShortcuts.tsx # Shortcuts modal
│   └── DeleteConfirmModal.tsx # Delete confirmation
├── hooks/
│   └── useHistory.ts        # Undo/redo functionality
├── services/
│   └── geminiService.ts     # AI integration
├── App.tsx                  # Main application
├── constants.tsx            # Templates and device configs
├── types.ts                 # TypeScript definitions
└── index.css                # Premium styles
```

## 🎯 Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first styling
- **Google Gemini AI** - AI-powered features
- **html-to-image** - Screenshot capture
- **JSZip** - Export packaging

## 📄 License

MIT License - Built with ❤️ for creators

---

**Version 5.0** | Premium Visual Pipeline
