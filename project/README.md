## SubTrack — Customer Subscription Management Dashboard (UI)

This project now includes a **backend API + SQLite database** so customer data is **real and persistent**.

### Run

#### 1) Start the backend (API + SQLite)

```powershell
node .\backend\server.js
```

Backend runs on **`http://localhost:5000`** and creates the SQLite file at `backend/data/subtrack.sqlite`.

#### 2) Start the frontend (static server)

Open `index.html` directly, or if your browser blocks ES module imports from `file://`, use a small static server:

```powershell
# Option A (Node built-in)
node -e "require('http').createServer((req,res)=>{const fs=require('fs');const path=require('path');const u=decodeURIComponent(req.url.split('?')[0]);const p=path.join(process.cwd(),u==='/'?'index.html':u);fs.readFile(p,(e,d)=>{if(e){res.statusCode=404;return res.end('Not found');}res.end(d);});}).listen(5173,()=>console.log('http://localhost:5173'))"
```

Then visit `http://localhost:5173`.

### Features

- Login page (demo: any credentials)
- Fixed sidebar + responsive mobile overlay
- Dashboard overview cards + progress bars
- Customers table:
  - Search (name/phone/IUC)
  - Add/Edit modal
  - Expired highlighting + “days remaining”
  - CSV export
  - Pagination
- Dark mode toggle + theme setting (light/dark/system)
- Toast notifications

### Data

Customers are stored in **SQLite** via the backend API.

