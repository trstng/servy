# Servy Deployment Guide

This guide walks you through deploying Servy to production using Railway (backend) and Vercel (frontend).

## Architecture Overview

- **Frontend**: Next.js 15 app deployed to Vercel
- **Backend**: Express MCP server deployed to Railway
- **Database**: Supabase (already hosted)

## Prerequisites

- GitHub repository with your code
- Railway account (https://railway.app)
- Vercel account (https://vercel.com)
- Supabase project with environment variables

## Part 1: Deploy Backend to Railway

### 1.1 Create New Railway Project

1. Go to https://railway.app/dashboard
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account if not already connected
5. Select your `servy` repository

### 1.2 Configure Backend Service

1. Railway will detect your project structure
2. Click "Add variables" to set up environment variables
3. Add the following environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://gwdhjrarwchjheqcurtl.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
MCP_PORT=3001
```

4. Configure the root directory:
   - Go to Settings → Service Settings
   - Set **Root Directory** to `backend`
   - Set **Start Command** to `npm start`

### 1.3 Deploy Backend

1. Click "Deploy"
2. Railway will:
   - Install dependencies from `/backend/package.json`
   - Run `npm start` which executes `tsx server.ts`
3. Once deployed, note your Railway service URL (e.g., `https://servy-backend-production.up.railway.app`)

### 1.4 Test Backend Deployment

Test the health endpoint:
```bash
curl https://your-railway-url.up.railway.app/health
```

Expected response:
```json
{
  "name": "Servy MCP Server",
  "version": "1.0.0",
  "description": "MCP server for booking home services",
  "status": "running"
}
```

## Part 2: Deploy Frontend to Vercel

### 2.1 Create New Vercel Project

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Vercel will detect Next.js automatically

### 2.2 Configure Frontend

1. Set **Root Directory** to `frontend`
2. Framework Preset: Next.js (auto-detected)
3. Build Command: `npm run build` (auto-detected)
4. Output Directory: `.next` (auto-detected)

### 2.3 Environment Variables

Add the following environment variables in Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=https://gwdhjrarwchjheqcurtl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 2.4 Deploy Frontend

1. Click "Deploy"
2. Vercel will:
   - Install dependencies from `/frontend/package.json`
   - Run `next build --turbopack`
   - Deploy your app
3. Note your Vercel URL (e.g., `https://servy-frontend.vercel.app`)

## Part 3: Connect to ChatGPT Apps SDK

### 3.1 Register Your MCP Server with ChatGPT

1. Go to https://chatgpt.com
2. Click your profile → Settings → Beta Features
3. Enable "Custom GPTs" if not already enabled
4. Go to https://chat.openai.com/gpts/editor
5. Click "Create" → "Configure" tab

### 3.2 Add MCP Server Details

In the "Actions" section:

1. **Schema**: Select "OpenAPI"
2. **API Endpoint**: Enter your Railway URL + `/mcp`
   ```
   https://your-railway-url.up.railway.app/mcp
   ```
3. **Authentication**: None (for now)

### 3.3 Test the Integration

1. In ChatGPT, ask: "Search for power washing services in Austin, Texas"
2. ChatGPT should call the `search_providers` tool
3. You should see a carousel of vendors with the LED blue/purple aesthetic

### 3.4 Debug Connection Issues

If you get errors:

**Check Railway Logs:**
```bash
# In Railway dashboard, go to your service → Deployments → View Logs
```

**Test MCP Endpoint:**
```bash
curl -X POST https://your-railway-url.up.railway.app/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05",
      "capabilities": {},
      "clientInfo": {
        "name": "test-client",
        "version": "1.0.0"
      }
    }
  }'
```

Expected response:
```json
{
  "result": {
    "protocolVersion": "2024-11-05",
    "capabilities": {
      "tools": {"listChanged": true},
      "resources": {"listChanged": true}
    }
  }
}
```

## Part 4: Environment Variables Reference

### Backend (.env in /backend)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://gwdhjrarwchjheqcurtl.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
MCP_PORT=3001
```

### Frontend (.env.local in /frontend)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://gwdhjrarwchjheqcurtl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Part 5: Local Development

### Run Backend Locally
```bash
cd backend
npm install
npm start
# Server runs on http://localhost:3001
```

### Run Frontend Locally
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:3000
```

## Part 6: Troubleshooting

### Railway Issues

**Build Fails:**
- Check that Root Directory is set to `backend`
- Verify package.json exists in `/backend`
- Check Railway logs for specific errors

**Server Won't Start:**
- Verify environment variables are set correctly
- Check that `MCP_PORT` is set (defaults to 3001)
- Ensure `tsx` is in dependencies (not devDependencies)

### Vercel Issues

**Build Fails:**
- Check that Root Directory is set to `frontend`
- Verify all dependencies are in `/frontend/package.json`
- Check Vercel build logs

**Environment Variables Not Loading:**
- Verify variables are set in Vercel dashboard
- Redeploy after adding new variables
- Check that variable names match exactly

### ChatGPT Connection Issues

**401 Unauthorized:**
- MCP endpoint must be publicly accessible
- Check Railway deployment is running
- Verify URL is correct in ChatGPT settings

**Tool Not Found:**
- Check that server.ts has `registerTool('search_providers', ...)`
- Verify Railway deployment succeeded
- Test MCP endpoint with curl (see above)

## Next Steps

1. **Add Authentication**: Implement API key authentication for MCP endpoint
2. **Custom Domain**: Add custom domain in Railway and Vercel
3. **Monitoring**: Set up error tracking (Sentry, LogRocket, etc.)
4. **Database**: Add more vendors to Supabase
5. **Features**: Build booking flow, payment integration, etc.

## Support

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **MCP SDK**: https://github.com/modelcontextprotocol/sdk
- **ChatGPT Apps**: https://platform.openai.com/docs/chatgpt-apps
