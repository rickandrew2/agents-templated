# Setup Script for Template Reorganization
# This script moves your existing files into the templates directory

Write-Host "Reorganizing project structure..." -ForegroundColor Cyan

# Create templates directory structure
$templateDir = "templates"
New-Item -ItemType Directory -Force -Path $templateDir | Out-Null
New-Item -ItemType Directory -Force -Path "$templateDir/agents/rules" | Out-Null
New-Item -ItemType Directory -Force -Path "$templateDir/agents/skills" | Out-Null
New-Item -ItemType Directory -Force -Path "$templateDir/.github" | Out-Null

# Copy documentation files
Write-Host "Copying documentation files..." -ForegroundColor Yellow
Copy-Item "AGENTS.MD" "$templateDir/AGENTS.MD" -Force -ErrorAction SilentlyContinue
Copy-Item "CLAUDE.md" "$templateDir/CLAUDE.md" -Force -ErrorAction SilentlyContinue
Copy-Item "AI_INSTRUCTIONS.md" "$templateDir/AI_INSTRUCTIONS.md" -Force -ErrorAction SilentlyContinue

# Copy agent rules
Write-Host "Copying agent rules..." -ForegroundColor Yellow
Copy-Item "agents/rules/*" "$templateDir/agents/rules/" -Recurse -Force -ErrorAction SilentlyContinue

# Copy agent skills
Write-Host "Copying agent skills..." -ForegroundColor Yellow
Copy-Item "agents/skills/*" "$templateDir/agents/skills/" -Recurse -Force -ErrorAction SilentlyContinue

# Create GitHub copilot instructions if it exists
if (Test-Path ".github/copilot-instructions.md") {
    Write-Host "Copying GitHub Copilot instructions..." -ForegroundColor Yellow
    Copy-Item ".github/copilot-instructions.md" "$templateDir/.github/copilot-instructions.md" -Force
}

# Create a simplified template README
$templateReadme = @"
# Technology-Agnostic Development Template

This template has been installed by the agents-templated npm package.

## What's Included

- **AGENTS.MD**: Agent patterns and delegation guide
- **CLAUDE.md**: Project guidelines and architecture
- **AI_INSTRUCTIONS.md**: Instructions for AI assistants
- **agents/rules/**: Development rules and patterns
- **agents/skills/**: Reusable agent skills
- **.github/copilot-instructions.md**: GitHub Copilot configuration

## Getting Started

1. Review CLAUDE.md for overall project guidelines
2. Review AGENTS.MD for agent patterns
3. Adapt the rules to your specific technology stack
4. Configure your AI assistant (Cursor, Copilot, etc.)

## Documentation

For full documentation, visit: https://github.com/yourusername/agents-templated

"@

$templateReadme | Out-File -FilePath "$templateDir/README.md" -Encoding UTF8

Write-Host "`nTemplate structure created successfully!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Review the templates/ directory"
Write-Host "2. Install dependencies: npm install"
Write-Host "3. Test locally: npm link"
Write-Host "4. Test in another project: agents-templated init"
Write-Host "5. Publish: npm publish"
