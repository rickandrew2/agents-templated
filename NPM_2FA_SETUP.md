# NPM Publishing - 2FA Setup Guide

## Issue

NPM requires two-factor authentication (2FA) to publish packages.

Error: `403 Forbidden - Two-factor authentication or granular access token with bypass 2fa enabled is required`

## Solution Options

### Option 1: Enable 2FA on Your NPM Account (Recommended)

1. **Visit NPM Website:**
   - Go to https://www.npmjs.com/settings/rickandrew2/tfa
   - Or: https://www.npmjs.com/ → Login → Profile → Account Settings → Two-Factor Authentication

2. **Enable 2FA:**
   - Choose "Authorization (recommended)" or "Authorization and Publishing"
   - Scan the QR code with an authenticator app (Google Authenticator, Authy, Microsoft Authenticator)
   - Enter the 6-digit code to verify
   - Save your recovery codes!

3. **Publish with 2FA:**
   ```bash
   npm publish
   # You'll be prompted for a one-time password (OTP)
   # Enter the 6-digit code from your authenticator app
   ```

4. **Or use OTP flag directly:**
   ```bash
   npm publish --otp=123456
   # Replace 123456 with your current authenticator code
   ```

### Option 2: Use Access Token (For CI/CD)

1. **Create an Automation Token:**
   - Go to https://www.npmjs.com/settings/rickandrew2/tokens
   - Click "Generate New Token"
   - Select "Automation" type (can publish without 2FA)
   - Copy the token (you'll only see it once!)

2. **Set the token:**
   ```bash
   npm config set //registry.npmjs.org/:_authToken YOUR_TOKEN_HERE
   ```

3. **Publish:**
   ```bash
   npm publish
   ```

4. **Clean up after (optional):**
   ```bash
   npm config delete //registry.npmjs.org/:_authToken
   ```

## Quick Fix (Enable 2FA Now)

**Fastest approach:**

1. Open: https://www.npmjs.com/settings/rickandrew2/tfa
2. Enable 2FA (takes 2 minutes)
3. Run: `npm publish --otp=YOUR_6_DIGIT_CODE`

## Verification

After setting up 2FA or token:

```bash
# Check you're logged in
npm whoami

# Try publishing
npm publish

# If successful, verify on NPM
# https://www.npmjs.com/package/agents-templated
```

## Troubleshooting

**"OTP required" error:**
- Make sure you're using the current 6-digit code (they expire every 30 seconds)
- Try: `npm publish --otp=YOUR_CODE`

**"Invalid token" error:**
- Re-login: `npm logout` then `npm login`
- Or regenerate access token

**"Package name taken":**
- Change name in package.json to: `@rickandrew2/agents-templated`
- Publish with: `npm publish --access public`

## After Successful Publishing

1. Your package will be live at: https://www.npmjs.com/package/agents-templated
2. Anyone can install with: `npm install -g agents-templated`
3. Update version for next publish: `npm version patch`

## Resources

- [NPM 2FA Documentation](https://docs.npmjs.com/configuring-two-factor-authentication)
- [NPM Access Tokens](https://docs.npmjs.com/creating-and-viewing-access-tokens)
