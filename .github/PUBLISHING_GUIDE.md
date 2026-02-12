# Quick Start: Publishing Your NPM Package

Follow these steps to convert your agents-templated project into a publishable npm package.

## Prerequisites

- Node.js installed (v14 or higher)
- NPM account (create at https://www.npmjs.com/signup)

## Step-by-Step Guide

### 1. Run the Setup Script

This reorganizes your project for npm packaging:

```powershell
.\setup-templates.ps1
```

**What it does:**
- Creates `templates/` directory
- Copies all template files into `templates/`
- Preserves your original files

### 2. Install Dependencies

```bash
npm install
```

This installs:
- `commander` - CLI framework
- `fs-extra` - File operations
- `chalk` - Colored terminal output
- `inquirer` - Interactive prompts

### 3. Update package.json

Edit [package.json](package.json) and update these fields:

```json
{
  "name": "agents-templated",  // Change if needed
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/agents-templated.git"
  }
}
```

**Choose a unique package name:**
- Check availability: `npm search your-package-name`
- If taken, try: `@yourusername/agents-templated` (scoped package)

### 4. Test Locally

Link the package to test it:

```bash
npm link
```

Navigate to another directory and test:

```bash
cd C:\Users\YourName\Desktop\test-project
agents-templated init

# Or test with specific options
agents-templated init --docs --rules
agents-templated list
```

### 5. Create GitHub Repository (Recommended)

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/agents-templated.git
git push -u origin main
```

### 6. Login to NPM

```bash
npm login
```

Enter your NPM credentials.

### 7. Publish!

```bash
npm publish
```

**For scoped packages (if using @username/package-name):**
```bash
npm publish --access public
```

## Usage After Publishing

Users can now install your package:

**Global installation:**
```bash
npm install -g agents-templated
agents-templated init
```

**Local installation:**
```bash
npm install --save-dev agents-templated
npx agents-templated init
```

## Updating Your Package

When you make changes:

```bash
# Make your changes to template files in templates/
# Update version
npm version patch  # 1.0.0 -> 1.0.1

# Publish update
npm publish

# Push to GitHub
git push && git push --tags
```

## Verification

After publishing, verify your package:

1. **Search on NPM:** https://www.npmjs.com/package/your-package-name
2. **Test installation:**
   ```bash
   npm install -g your-package-name
   mkdir test && cd test
   your-package-name init
   ```

## Troubleshooting

### Package name already taken
- Use scoped package: `@yourusername/agents-templated`
- Choose different name

### Permission denied
- Run `npm login` first
- Check you're logged in: `npm whoami`

### Files missing from package
- Check `files` field in package.json
- Review .npmignore
- Test before publishing: `npm pack`

### Module not found errors
- Ensure dependencies are in `dependencies`, not `devDependencies`
- Run `npm install` again

## Best Practices

✅ **Start with version 1.0.0** for your first release
✅ **Use semantic versioning** (MAJOR.MINOR.PATCH)
✅ **Test locally** before every publish
✅ **Update README** with clear usage examples
✅ **Add a LICENSE** (MIT is common for templates)
✅ **Create GitHub releases** for major versions

## Next Steps

After publishing:

1. **Add badges to README:**
   ```markdown
   ![npm version](https://img.shields.io/npm/v/agents-templated.svg)
   ![npm downloads](https://img.shields.io/npm/dm/agents-templated.svg)
   ```

2. **Share your package:**
   - Post on Twitter/LinkedIn
   - Submit to awesome lists
   - Write a blog post

3. **Maintain your package:**
   - Respond to issues
   - Update dependencies
   - Add new features

## Resources

- [NPM Documentation](https://docs.npmjs.com/)
- [Semantic Versioning](https://semver.org/)
- [Creating Node CLI Tools](https://nodejs.dev/learn/how-to-build-a-cli-with-node-js)

---

**Need Help?** See [NPM_PACKAGE_GUIDE.md](NPM_PACKAGE_GUIDE.md) for detailed documentation.
