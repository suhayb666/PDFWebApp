# File2PDF - File to PDF Converter

Convert PNG, JPEG, Word, and Excel files to PDF format.

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
# Initialize Prisma
npx prisma init

# Run migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

### 3. Configure Environment Variables
Create `.env.local` file with:
```
DATABASE_URL="your_neondb_url"
SENDGRID_API_KEY="your_sendgrid_key"
SENDGRID_FROM_EMAIL="noreply@yourdomain.com"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 4. Install LibreOffice (for Word conversion)
```bash
# Ubuntu/Debian
sudo apt-get install libreoffice

# macOS
brew install libreoffice
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📦 Deployment (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## 🔒 Security Features

- File type validation
- Size limit enforcement (50MB)
- Auto-deletion after 1 hour
- HTTPS enforced
- Sanitized filenames

## 📝 License
MIT
```

---

## ✅ Installation & Deployment Steps

### Step 1: Create Project
```bash
npx create-next-app@latest file2pdf --typescript --tailwind --app
cd file2pdf
```

### Step 2: Install Dependencies
```bash
npm install @prisma/client prisma pdf-lib sharp exceljs pdfkit @sendgrid/mail lucide-react
npm install -D @types/pdfkit
```

### Step 3: Setup Prisma
```bash
npx prisma init
# Edit prisma/schema.prisma with the schema above
npx prisma migrate dev --name init
npx prisma generate
```

### Step 4: Create All Files
Copy all the files above into their respective locations

### Step 5: Run Development
```bash
npm run dev
```

### Step 6: Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

---

## 🎯 Summary

**YES, the first file I created was `page.tsx`** - it's the main React component that handles the entire frontend UI. It should go in the `app/` folder as `app/page.tsx`.

All files are now documented above with their exact folder locations! 🚀