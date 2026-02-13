# Changelog

## Version 1.1.0 - Feature-Rich Release (February 13, 2026)

### 🎉 Major New Features

#### Quick Start Presets
- **5 Pre-configured Tech Stack Presets**:
  - `nextjs` - Next.js with TypeScript, React, and Tailwind CSS
  - `django-react` - Django REST Framework backend with React frontend
  - `express-api` - RESTful API with Express.js and TypeScript
  - `fastapi` - Modern Python API with FastAPI
  - `go-api` - High-performance API with Go and Gin
- Each preset includes recommended packages, gitignore patterns, and npm scripts
- Usage: `agents-templated init --preset=<name>`

#### Interactive Setup Wizard
- New `agents-templated wizard` command for guided setup
- Step-by-step project type selection (fullstack, frontend, backend, etc.)
- Framework and database selection with context-aware prompts
- Personalized package recommendations based on your choices
- Smart component installation suggestions

#### Project Validation & Health Checks
- **validate command**: Quick validation of project setup and configuration
  - Checks for required files (AGENTS.MD, agent rules, etc.)
  - Validates agent rules syntax
  - Verifies AI assistant configurations
  - Provides actionable recommendations
- **doctor command**: Comprehensive health check with detailed diagnostics
  - Security pattern verification
  - Testing strategy validation
  - Configuration completeness checks
  - Quick tips and best practices

#### Template Update System
- New `agents-templated update` command to keep templates in sync
- Checks for file differences between local and latest templates
- Interactive update process with backup creation
- `--check-only` flag to preview available updates
- Automatic backup files (`.backup` extension) before applying updates

#### Comprehensive Testing
- Full Jest test suite added for all core functionality
- Test commands in package.json:
  - `npm test` - Run all tests
  - `npm run test:watch` - Watch mode for development
  - `npm run test:coverage` - Coverage reports
  - `npm run test:ci` - CI-optimized testing
- Tests cover file operations, CLI commands, and edge cases

### 🔧 Improvements

#### Enhanced CLI
- Updated `list` command to show both components and presets
- Better error messages with actionable suggestions
- Improved console output with clearer formatting
- Version bumped to 1.1.0 across all files

#### Package Updates
- Added Jest and testing dependencies
- Updated scripts in package.json for testing
- Included `templates/presets` directory in published package
- Better file organization and structure

#### Documentation
- Updated README with all new features
- Added "What's New in v1.1.0" section
- Enhanced CLI usage examples with presets
- Better quick start documentation

### 📦 Breaking Changes
None - fully backward compatible with v1.0.x

### 🐛 Bug Fixes
- Improved file path handling across different operating systems
- Better error handling in file copy operations
- Fixed edge cases in component installation

### 📝 Developer Experience
- Added comprehensive test coverage for maintainability
- Better code organization with separated concerns
- Improved error handling and user feedback

---

## Version 1.0.1 - Professional Update

## Changes Made

### ✅ Removed All Emojis (Professional Appearance)

**Before:**
```
🤖 Agents Templated - AI-Powered Development Setup
📄 Installing documentation files...
  ✓ AGENTS.MD
✅ Installation complete!
```

**After:**
```
Agents Templated - AI-Powered Development Setup
Installing documentation files...
  + AGENTS.MD
Installation complete!
```

### ✅ Excluded Development Documentation

The following files are now **excluded from the published package** (only in your repo):
- `NPM_2FA_SETUP.md` - 2FA setup instructions
- `PUBLISHING_GUIDE.md` - Publishing guide
- `GET_STARTED.md` - Setup guide
- `NPM_PACKAGE_GUIDE.md` - Detailed package documentation
- `setup-templates.ps1` - Setup script
- `.gitignore` - Git ignore rules
- `.gitattributes` - Git attributes

**Result:** Users only get the essential template files, not the package development documentation.

### ✅ Enhanced Security (.gitignore)

Added comprehensive security patterns to prevent accidental commits of sensitive data:

**Protected Files:**
- Private keys (*.key, *.pem, id_rsa, etc.)
- Certificates (*.cer, *.crt, *.jks, etc.)
- API keys and tokens (.api-keys, .credentials)
- NPM tokens (.npmrc)
- Production environment files (.env.production, .env.staging)

**Git Guardian Compliant:** These patterns prevent most common security leaks.

## Published Package Contents

Your package now includes **only 18 essential files**:

```
agents-templated@1.0.1/
├── LICENSE
├── README.md
├── bin/cli.js (professional, no emojis)
├── index.js
├── package.json
└── templates/
    ├── .github/copilot-instructions.md
    ├── AGENTS.MD
    ├── AI_INSTRUCTIONS.md
    ├── CLAUDE.md
    ├── README.md
    └── agents/
        ├── rules/ (6 files)
        └── skills/ (2 files)
```

## Verification

✅ **NPM Package:** https://www.npmjs.com/package/agents-templated  
✅ **GitHub Repo:** https://github.com/rickandrew2/agents-projects-templated  
✅ **Version:** 1.0.1  
✅ **Package Size:** 35.1 kB (clean and minimal)

## Test Results

```bash
npm install -g agents-templated@latest
agents-templated list
# Output: Clean, professional, no emojis ✓

agents-templated init --docs
# Output: Professional installation messages ✓
```

## Security Features

### Git Guardian Protection

Your `.gitignore` now prevents commits of:
- 🔒 SSH keys and certificates
- 🔒 API keys and credentials
- 🔒 NPM authentication tokens
- 🔒 Production environment files
- 🔒 Keystore files

### NPM Package Security

Your `.npmignore` prevents publishing:
- 🔒 Development documentation
- 🔒 Setup scripts
- 🔒 Git configuration
- 🔒 Test files
- 🔒 Environment files

## User Experience

### For New Users

When someone installs your package, they get:
1. **Clean professional CLI** - No emoji clutter
2. **Only template files** - No confusing development docs
3. **Simple commands** - Easy to understand output
4. **Security-first** - Protected pattern files

### Installation Example

```bash
# Global install
npm install -g agents-templated

# Use in any project
cd my-project
agents-templated init --all
```

**Output:**
```
Agents Templated - AI-Powered Development Setup

Installing documentation files...
  + AGENTS.MD
  + CLAUDE.md
  + AI_INSTRUCTIONS.md
  + README.md

Installing agent rules...
  + agents\rules\core.mdc
  + agents\rules\database.mdc
  [...]

Installation complete!

Next steps:
  1. Review CLAUDE.md for project guidelines
  2. Review AGENTS.MD for agent patterns
  3. Configure your AI assistant (Cursor, Copilot, etc.)
  4. Adapt the rules to your technology stack
```

## Benefits

### Professional
- ✅ Clean, corporate-ready output
- ✅ No unnecessary visual elements
- ✅ Focused on functionality

### User-Friendly
- ✅ Less confusion (no dev docs in package)
- ✅ Clear, readable output
- ✅ Straightforward commands

### Secure
- ✅ Git Guardian compliant patterns
- ✅ Protected against common security leaks
- ✅ No sensitive files in package or commits

## Next Release

When you make future updates:

```bash
# Make changes
git add .
git commit -m "Description of changes"

# Bump version
npm version patch  # 1.0.1 -> 1.0.2
# or
npm version minor  # 1.0.1 -> 1.1.0

# Publish
npm publish

# Push to GitHub
git push origin main --tags
```

## Summary

Your npm package is now:
- ✅ **Professional** - No emojis, clean output
- ✅ **Minimal** - Only 18 essential files
- ✅ **Secure** - Git Guardian protected
- ✅ **User-friendly** - No confusing dev docs
- ✅ **Production-ready** - Corporate-grade quality

**Live at:** https://www.npmjs.com/package/agents-templated  
**Downloads:** Anyone can now install with `npm install -g agents-templated`
