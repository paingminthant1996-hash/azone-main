# Cloudflare MCP Keys Fix Guide

## Problem: Cloudflare MCP Keys မှန်အောင်ထည့်ထားလဲ ဝင်မရဘူး

## Root Cause

MCP configuration file (`.cursor/mcp.json`) မှာ environment variables က `${VARIABLE_NAME}` format သုံးထားတယ်။  
ဒါက Cursor IDE က local environment variables ကို read လုပ်တယ်, Cloudflare MCP server က remote environment မှာ run လုပ်တာကြောင့် keys မရဘူး။

---

## Solution: Check Environment Variables

### Step 1: Verify Local Environment Variables

`.cursor/mcp.json` က local environment variables ကို use လုပ်တယ်:

```json
{
  "mcpServers": {
    "cloudflare": {
      "env": {
        "CLOUDFLARE_API_TOKEN": "${CLOUDFLARE_API_TOKEN}",
        "CLOUDFLARE_ACCOUNT_ID": "${CLOUDFLARE_ACCOUNT_ID}"
      }
    }
  }
}
```

### Step 2: Set Local Environment Variables

**Windows (.env.local or system environment):**
```env
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
```

**Or set in system environment variables:**
1. Windows Settings → System → Environment Variables
2. Add:
   - `CLOUDFLARE_API_TOKEN` = your token
   - `CLOUDFLARE_ACCOUNT_ID` = your account ID

### Step 3: Restart Cursor IDE

Environment variables ထည့်ပြီးရင်:
1. **Close Cursor IDE completely**
2. **Restart Cursor IDE**
3. MCP servers auto-start လုပ်ပါမယ်

---

## Alternative: Direct Values (Not Recommended)

If environment variables don't work, you can set direct values (less secure):

```json
{
  "mcpServers": {
    "cloudflare": {
      "env": {
        "CLOUDFLARE_API_TOKEN": "your-actual-token-here",
        "CLOUDFLARE_ACCOUNT_ID": "your-actual-account-id-here"
      }
    }
  }
}
```

**⚠️ Warning:** Don't commit this to Git! Add to `.gitignore`.

---

## Get Cloudflare Keys

### CLOUDFLARE_API_TOKEN

1. **Cloudflare Dashboard** → **My Profile** → **API Tokens**
2. **Create Token** → **Edit Cloudflare Workers** template
3. **Permissions:**
   - Account: Workers Scripts: Edit
   - Account: Account Settings: Read
   - Zone: Zone Settings: Read (if needed)
4. **Continue to summary** → **Create Token**
5. Copy token

### CLOUDFLARE_ACCOUNT_ID

1. **Cloudflare Dashboard** → **Workers & Pages**
2. **Right sidebar** → **Account ID** (copy this)
3. (သို့မဟုတ်) **Any domain** → **Overview** → **Right sidebar** → **Account ID**

---

## Verification

After setting variables and restarting Cursor:

1. **Cursor IDE** → **MCP Servers** (check status)
2. **Cloudflare MCP** → Should show "Connected"
3. Try using MCP tools → Should work

---

## Troubleshooting

### Issue 1: "MCP server failed to start"

**Fix:**
- Check environment variables are set correctly
- Restart Cursor IDE
- Check `.cursor/mcp.json` syntax is valid JSON

### Issue 2: "Invalid API token"

**Fix:**
- Verify token is correct (copy from Cloudflare Dashboard)
- Check token permissions (Workers Scripts: Edit)
- Token might be expired → Create new token

### Issue 3: "Account ID not found"

**Fix:**
- Verify Account ID from Cloudflare Dashboard
- Check it's the correct account (not zone ID)

---

## Current Configuration

- **MCP Config**: `.cursor/mcp.json`
- **Environment Variables**: `${CLOUDFLARE_API_TOKEN}`, `${CLOUDFLARE_ACCOUNT_ID}`
- **Action Needed**: Set local environment variables and restart Cursor

---

## Next Steps

1. **Set environment variables** (Windows system or `.env.local`)
2. **Restart Cursor IDE**
3. **Verify MCP connection**
4. **Test Cloudflare MCP tools**
