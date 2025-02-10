# Trackless

Privacy Without the Footprint 🛡️

Trackless is a powerful Chrome extension designed to protect your online privacy by blocking trackers, managing cookies, and ensuring a safer browsing experience with minimal effort.

![icon128](https://github.com/user-attachments/assets/6e867494-9561-4682-b6be-92df71cfb6c0)

## Features

### 🚫 Tracker Blocking
- Automatically blocks common tracking scripts and analytics
- Real-time counter shows how many trackers have been blocked
- Optimized blocking rules to prevent website breakage

### 🍪 Cookie Management
- One-click cookie clearing
- Detailed statistics on cookies cleared
- Intelligent cookie handling to maintain essential website functionality

### ⚪ Whitelist Mode
- Add trusted websites to bypass tracking protection
- Perfect for sites that require cookies for functionality
- Easy toggle between full protection and whitelist mode

### 🔒 Privacy Shield
- Master switch to enable/disable all privacy features
- Real-time privacy status indicator
- Zero configuration required

## Installation

1. Download the extension from the Chrome Web Store (link coming soon)
2. Click "Add to Chrome" to install
3. Click the Trackless icon in your toolbar to start protecting your privacy

## Manual Installation (Developer Mode)

1. Clone this repository:
```bash
git clone https://github.com/yourusername/trackless.git
```

2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the cloned repository folder
5. The Trackless icon should appear in your Chrome toolbar

## Usage

1. Click the Trackless icon in your Chrome toolbar to open the popup
2. Toggle the Privacy Shield switch to enable/disable protection
3. Use the Whitelist toggle to enable/disable Whitelist Mode
4. Click "Add Current Site" to add a website to your whitelist
5. View real-time statistics on blocked trackers and cleared cookies
6. Use the "Clear Cookies" button to manually clear all cookies

## Technical Details

- Built with vanilla JavaScript
- Uses Chrome Extension Manifest V3
- Implements modern privacy protection techniques
- Optimized for performance and minimal memory usage

## Project Structure

```
trackless/
├── background.js      # Background service worker
├── manifest.json      # Extension manifest
├── popup/
│   ├── popup.html    # Main popup interface
│   ├── popup.css     # Popup styles
│   ├── popup.js      # Popup functionality
│   ├── faq.html      # FAQ page
│   └── faq.css       # FAQ styles
└── images/           # Extension icons and assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Privacy Policy

Trackless is committed to user privacy:
- No user data collection
- No analytics or tracking
- No external services
- All operations performed locally

## Support

- Open an issue for bug reports or feature requests
- Check the FAQ page in the extension for common questions
- Contact me at dinukajkdy2.0@gmail.com for additional help

## Authors

- Dinuka Tharinda
- Contributors welcome!

