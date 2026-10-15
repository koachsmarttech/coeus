# Coeus — local run

```powershell
npm install
npm run dev
```

Open **http://localhost:8080** (same host you start with).

## Invalid origin on sign-up / sign-in

1. Use exactly **http://localhost:8080** in the browser address bar.
2. If Vite printed another port (e.g. 5173), either free 8080 or set:

```powershell
$env:BETTER_AUTH_URL="http://localhost:5173"
npm run dev
```

3. Or list extra origins:

```powershell
$env:TRUSTED_ORIGINS="http://localhost:5173,http://127.0.0.1:5173"
```

4. Hard-refresh (Ctrl+Shift+R) after changing env.

## AI (optional)

```powershell
$env:OPENAI_API_KEY="sk-..."
npm run dev
```

## Roles

- First account = **Admin**
- **Reporter** files reports (no Ask)
- **Analyst** / **Admin** get Ask and briefs
