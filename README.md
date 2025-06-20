# Hatsune Miku Party Invitation

A simple and fun party invitation website with RSVP functionality.

## Features

- RSVP form for guests to respond
- Guest list summary view
- Responsive design
- Client-side storage (no backend required)

## Local Development

1. Clone the repository
2. Open `public/index.html` in a web browser

For live reload during development:

```bash
# Install live-server if you don't have it
npm install -g live-server

# Start the development server
live-server public
```

## Deployment

### Option 1: Vercel (Recommended)

1. Push your code to a GitHub repository
2. Go to [Vercel](https://vercel.com/)
3. Click "New Project" and import your repository
4. Vercel will automatically detect the static site and deploy it

### Option 2: GitHub Pages

1. Push your code to a GitHub repository
2. Go to Repository Settings > Pages
3. Set the source to deploy from the `public` folder
4. Save and your site will be live at `https://<username>.github.io/<repository-name>`

## How It Works

- Responses are stored in the browser's localStorage
- No server or database required
- Works offline after the first load

## Customization

- Update the event details in `public/index.html`
- Modify styles in `static/styles.css`
- The guest list is stored in the browser's localStorage
