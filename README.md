# Basedash Documentation

This repository contains the documentation for Basedash, our AI-native business intelligence platform. This guide will help you get set up and make changes to the documentation.

## Initial Setup

1. **Install Required Software**
   - Install [Git](https://git-scm.com/downloads) if you don't have it
   - Install [Node.js](https://nodejs.org/) (which includes npm)
   - Install [Cursor](https://cursor.sh/) - this is the AI-powered editor we use

2. **Clone the Repository**
   Open Terminal and run these commands:

   ```bash
   cd Documents  # or wherever you want to store the project
   git clone https://github.com/Basedash/docs.git
   cd docs
   ```

3. **Install Dependencies**
   ```bash
   pnpm add -g mint  # Install Mintlify CLI globally
   ```

## Making Changes

You'll need to follow these steps every time you want to make a change.

1. **Get Latest Changes**
   Before making any changes, always get the latest updates:

   ```bash
   git pull origin main
   ```

2. **Using Cursor**
   - Open Cursor
   - Choose "Open Folder" and select the `docs` folder
   - Press ⌘I to activate the AI assistant
   - Type your request in plain English, and the AI will help you make changes

3. **Testing Your Changes**
   To preview your changes locally, run:

   ```bash
   mint dev
   ```

   This will start a local server at http://localhost:3000 where you can preview the changes.

4. **Saving Your Changes**
   After making changes, run:
   ```bash
   git add .
   git commit -m "Describe your changes briefly here"
   git push origin main
   ```

## Troubleshooting

- If `mint dev` isn't working:
  - Run `mint install` to reinstall dependencies
- If a page shows as 404:
  - Make sure you're in the correct folder with `docs.json`

## Publishing

Changes will automatically be deployed to production after pushing to the main branch.

## Public API documentation

Our public API reference pages are automatically generated from our OpenAPI specification hosted at https://charts.basedash.com/api/public/openapi. Mintlify reads this spec and auto-populates the API endpoint pages, so there's no need to manually create or update individual API pages.

For more details on how this works, see the [Mintlify OpenAPI setup documentation](https://www.mintlify.com/docs/api-playground/openapi-setup#dedicated-api-sections).

## Need Help?

If you get stuck at any point:

1. Use the Cursor AI to ask for help
2. Reach out to the development team on Slack
3. Check the [Mintlify documentation](https://mintlify.com/docs)
