# Agents Templated - NPM Package Guide

## Overview

This guide explains how to publish and use your agents-templated as an npm package that can be installed in existing projects.

## Project Structure

```
agents-templated/
├── bin/                    # CLI executable
│   └── cli.js
├── templates/              # Template files to copy
│   ├── AGENTS.MD
│   ├── CLAUDE.md
│   ├── AI_INSTRUCTIONS.md
│   ├── README.md
│   ├── agents/
│   │   ├── rules/
│   │   └── skills/
│   └── .github/
│       └── copilot-instructions.md
├── index.js                # Programmatic API
├── package.json
├── LICENSE
└── README.md
```

## Setup Steps

### 1. Reorganize Your Project

Run the setup script to move template files into the `templates` directory:

```powershell
.\setup-templates.ps1
```

This creates the proper structure for npm packaging.

### 2. Install Dependencies

```bash
npm install
```

### 3. Test Locally

Link the package locally to test before publishing:

```bash
npm link
```

Then in another project directory:

```bash
agents-templated init
```

### 4. Publish to NPM

**First time publishing:**

```bash
# Login to npm
npm login

# Publish the package
npm publish
```

**Subsequent updates:**

```bash
# Update version
npm version patch  # or minor, or major

# Publish
npm publish
```

## Usage

### Global Installation

Users can install your package globally:

```bash
npm install -g agents-templated
```

Then use it in any project:

```bash
cd my-existing-project
agents-templated init
```

### Local Installation (Alternative)

Or install as a dev dependency in a specific project:

```bash
npm install --save-dev agents-templated
npx agents-templated init
```

### CLI Commands

**Initialize in current directory:**
```bash
agents-templated init
```

**Install specific components:**
```bash
# Documentation only
agents-templated init --docs

# Rules only
agents-templated init --rules

# Skills only
agents-templated init --skills

# GitHub Copilot instructions
agents-templated init --github

# All components
agents-templated init --all

# Force overwrite existing files
agents-templated init --all --force
```

**List available components:**
```bash
agents-templated list
```

### Programmatic API

Users can also use the package programmatically in their build scripts:

```javascript
const agentsTemplated = require('agents-templated');

// Install all components
await agentsTemplated.install('./my-project', {
  force: true
});

// Install specific components
await agentsTemplated.install('./my-project', {
  docs: true,
  rules: true,
  force: false
});
```

## Package Configuration

### Update package.json

Before publishing, update these fields in `package.json`:

```json
{
  "name": "agents-templated",           // Your package name
  "version": "1.0.0",                   // Semantic versioning
  "author": "Your Name",                // Your name
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/agents-templated.git"
  }
}
```

### Choose a Package Name

If "agents-templated" is taken, try:
- `@yourusername/agents-templated` (scoped package)
- `ai-agents-template`
- `dev-agents-kit`
- `code-agents-template`

Check availability:
```bash
npm search agents-templated
```

## Publishing Checklist

- [ ] Run `setup-templates.ps1` to organize structure
- [ ] Update `package.json` with your details
- [ ] Test locally with `npm link`
- [ ] Create a GitHub repository
- [ ] Add a comprehensive README
- [ ] Create a LICENSE file (MIT recommended)
- [ ] Test the CLI in a sample project
- [ ] Login to npm: `npm login`
- [ ] Publish: `npm publish`

## Updating the Package

After making changes:

```bash
# Make your changes
git add .
git commit -m "Description of changes"

# Update version (automatically creates git tag)
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0

# Publish
npm publish

# Push to GitHub
git push && git push --tags
```

## Best Practices

1. **Semantic Versioning**: Follow semver.org
   - PATCH: Bug fixes
   - MINOR: New features (backwards compatible)
   - MAJOR: Breaking changes

2. **Testing**: Always test locally before publishing

3. **Documentation**: Keep README up to date

4. **Changelog**: Maintain a CHANGELOG.md file

5. **GitHub Releases**: Create releases for major versions

## Troubleshooting

**Error: Package name already taken**
- Use a scoped package: `@yourusername/agents-templated`
- Choose a different name

**Error: Permission denied**
- Run `npm login` first
- Check you have publish rights

**Error: Files not included in package**
- Check `files` field in package.json
- Review .npmignore file
- Test with `npm pack` to see what will be included

## Support

For issues and questions:
- GitHub Issues: https://github.com/yourusername/agents-templated/issues
- Documentation: https://github.com/yourusername/agents-templated

## License

MIT - See LICENSE file
