# Rod Samra - Strategic HR & Compliance Consultant Website

A professional, modern, and responsive business website built with plain HTML, CSS, and JavaScript.

## 🌟 Features

- **Responsive Design**: Fully responsive across desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional design with smooth animations and transitions
- **Dynamic Content**: Blog posts and site content managed through JSON files
- **Admin Panel**: Simple content management system for editing site content
- **Contact Form**: Integrated contact form with email functionality
- **LinkedIn Integration**: Direct links to LinkedIn profile throughout the site

## 📁 Project Structure

```
rod-samra-website/
│
├── public/
│   ├── index.html                  # Home page
│   ├── css/
│   │   └── styles.css             # Main stylesheet
│   └── images/                     # Image assets
│
├── src/
│   ├── pages/
│   │   ├── services.html          # Services page
│   │   ├── training.html          # Training page
│   │   ├── about.html             # About page
│   │   ├── blog.html              # Blog page
│   │   └── admin.html             # Admin panel
│   │
│   ├── components/
│   │   ├── navbar.html            # Navigation bar
│   │   ├── footer.html            # Footer
│   │   └── contactForm.html       # Contact form popup
│   │
│   ├── scripts/
│   │   ├── main.js                # Main JavaScript
│   │   ├── blog.js                # Blog functionality
│   │   ├── admin.js               # Admin panel
│   │   └── dataManager.js         # Data management
│   │
│   └── data/
│       ├── articles.json          # Blog articles
│       └── siteContent.json       # Site content
│
└── vercel.json                     # Deployment configuration
```

## 🚀 Getting Started

### Local Development

1. Clone or download this repository
2. Open `public/index.html` in a web browser
3. For full functionality, use a local server:
   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx serve
   ```
4. Navigate to `http://localhost:8000/public/index.html`

### Admin Panel Access

- URL: `/src/pages/admin.html`
- Default credentials:
  - Email: `admin@rodsamra.com`
  - Password: `admin123`

**Note**: Change these credentials before deploying to production!

## 📝 Content Management

### Editing Blog Posts

1. Access the admin panel at `/src/pages/admin.html`
2. Log in with admin credentials
3. Add, edit, or delete blog articles
4. Save changes (currently stored in browser localStorage for demo)

### Editing About Page

1. Access the admin panel
2. Edit the biography text
3. Save changes

### JSON Data Structure

**articles.json:**
```json
[
  {
    "id": "1",
    "title": "Article Title",
    "date": "2025-02-15",
    "excerpt": "Short description...",
    "content": "Full article content...",
    "linkedinUrl": "https://linkedin.com/..."
  }
]
```

**siteContent.json:**
```json
{
  "aboutBio": "Biography text...",
  "homeHeroTitle": "Rod Samra",
  "contactEmail": "email@example.com"
}
```

## 🎨 Customization

### Colors

Edit CSS variables in `public/css/styles.css`:

```css
:root {
    --primary-blue: #0066cc;
    --dark-blue: #0052a3;
    --gray-dark: #333333;
    /* ... */
}
```

### Images

Place images in `public/images/` directory:
- `logo.png` - Logo image
- `hero-bg.jpg` - Hero background
- `rod-portrait.jpg` - Profile photo
- `linkedin-icon.png` - LinkedIn icon

## 📧 Contact Form Setup

### Current Setup (Demo)
The contact form uses `mailto:` links as a fallback.

### Recommended Setup (Production)

1. **Formspree** (Easiest):
   - Sign up at [formspree.io](https://formspree.io)
   - Get your form endpoint
   - Update `src/components/contactForm.html`:
     ```html
     <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
     ```

2. **EmailJS** (Free tier available):
   - Sign up at [emailjs.com](https://www.emailjs.com)
   - Follow their integration guide

3. **Custom Backend**:
   - Implement server-side form handling
   - Update form action in `contactForm.html`

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Deploy automatically
4. Custom domain configuration in Vercel settings

### Alternative Hosting

- **Netlify**: Drag & drop folder or connect GitHub
- **GitHub Pages**: Push to `gh-pages` branch
- **Traditional Hosting**: Upload via FTP to web host

## 🔒 Security Notes

1. **Change admin credentials** in `src/scripts/admin.js` before deployment
2. **Implement server-side authentication** for production admin panel
3. **Use environment variables** for sensitive data
4. **Enable HTTPS** on your domain

## 🔄 Future Enhancements

### Backend Integration

Replace localStorage with a real backend:

```javascript
// Example: Replace in dataManager.js
async saveArticles(articles) {
    await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articles)
    });
}
```

### Suggested Tech Stack
- **Backend**: Node.js + Express, or Firebase
- **Database**: MongoDB, PostgreSQL, or Firestore
- **Authentication**: JWT tokens, Firebase Auth, or Auth0

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

Built with Claude Code for Rod Samra Strategic HR & Compliance Consulting.

## 📞 Support

For questions or issues:
- Email: pedrosamsan@gmail.com
- LinkedIn: [Rod Samra](https://www.linkedin.com/in/rod-samra-mba-sphr-3a328039/)

---

**Note**: This is a client-side demo. For production use, implement proper backend services for data persistence and authentication.
