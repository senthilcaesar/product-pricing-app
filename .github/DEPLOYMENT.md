# GitHub Pages Deployment

This repository is configured to automatically deploy to GitHub Pages using GitHub Actions.

## 🚀 Setup Instructions

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**

### 2. Push to GitHub

Once you push to the `main` or `master` branch, the workflow will automatically:
- Install dependencies
- Run linting
- Build the Next.js application
- Deploy to GitHub Pages

### 3. Access Your Application

After the first successful deployment, your app will be available at:
```
https://<your-username>.github.io/vote-app/
```

## 📋 Configuration

The following files have been configured for GitHub Pages deployment:

### `next.config.ts`
- `output: 'export'` - Enables static site generation
- `basePath: '/vote-app'` - Sets the base path for GitHub Pages subdirectory
- `images.unoptimized: true` - Disables Next.js image optimization (not supported in static exports)

### `.github/workflows/deploy.yml`
- Triggers on push to `main` or `master` branch
- Can also be manually triggered from the Actions tab
- Builds and deploys the static site to GitHub Pages

## 🔧 Manual Deployment

You can manually trigger a deployment:
1. Go to the **Actions** tab in your repository
2. Select **Deploy to GitHub Pages** workflow
3. Click **Run workflow**

## 🧪 Local Testing

Before pushing, test your build locally:

```bash
# Install dependencies
pnpm install

# Run linter
pnpm run lint

# Build the application
pnpm run build

# The static files will be in the 'out' directory
```

## 📊 Monitoring Deployments

- Go to the **Actions** tab to see workflow runs
- Click on a workflow run to view detailed logs
- Check the **Environments** section to see deployment history

## ⚠️ Important Notes

1. **Static Export Only**: GitHub Pages only supports static sites. Server-side features like API routes won't work.
2. **Base Path**: All links in your app should account for the `/vote-app` base path.
3. **Image Optimization**: Next.js image optimization is disabled for static exports.

## 🐛 Troubleshooting

### Build Fails
- Check the Actions logs for specific error messages
- Ensure `pnpm run build` works locally
- Verify all dependencies are in `package.json`

### 404 Errors
- Ensure GitHub Pages is enabled in repository settings
- Check that the base path in `next.config.ts` matches your repository name
- Wait a few minutes after the first deployment

### Images Not Loading
- Ensure images are in the `public` folder
- Use relative paths or the Next.js `Image` component
- Remember that image optimization is disabled

## 📚 Resources

- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
