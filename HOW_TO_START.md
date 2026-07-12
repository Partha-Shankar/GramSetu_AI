# How to Build Your Module (Developer Guide)

Welcome to the team! This guide will show you how to build your module. 

To make things easy and avoid mistakes, you have **full independence**. This means you will write code **only** inside your own folder. 


---

## The Rule of Independence
You have your own sandbox folder. You must **only** create and edit files inside your folder:
- **Developer 1 (SwachhAudit)**: Only edit files inside `app/swachhaudit/`
- **Developer 2 (JalDrishti)**: Only edit files inside `app/jaldrishti/`
- **Developer 3 (GramLipi)**: Only edit files inside `app/gramlipi/`
- **Developer 4 (SwachhSankalp)**: Only edit files inside `app/swachhsankalp/`

Do **not** edit any files in the root folders (like `components/`, `contexts/`, `constants/`, `utils/`, or `app/layout.tsx`). Leave those files to Developer 1.

---

## Step-by-Step Instructions

### Step 1: Create a Branch
Before writing code, create a branch for your work:
1. Open your terminal.
2. Switch to the main code branch:
   ```bash
   git checkout main
   git pull origin main
   ```
3. Create your own branch. Name it after your folder and what you are building:
   ```bash
   git checkout -b your-module-name/your-feature
   ```
   *(Example: `git checkout -b swachhaudit/add-camera-view`)*

### Step 2: Write Your Types (Optional)
If your code needs special data structures (like a list of audit items or pH levels):
1. Open your module's `types/` folder.
2. Create a TypeScript file (like `types.ts`).
3. Define your interfaces there.

### Step 3: Write Your Services
If you need to fetch data, save files locally, or run AI models:
1. Open your module's `services/` folder.
2. Create a service file (like `dbService.ts` or `aiModel.ts`).
3. Write your helper functions there.

### Step 4: Build Your Custom UI Components
Build the visual parts of your module (like forms, grids, camera scanners, or buttons):
1. Open your module's `components/` folder.
2. Create your React components here.
3. You can import and use shared components from the root folder if you want to (like `@/components/ui/button` or `@/components/ui/card`), or you can write your own styles from scratch.

### Step 5: Wire Everything in Your Main Page
Assemble your components inside your module's main page:
1. Open your module's `page.tsx` file (for example: `app/swachhaudit/page.tsx`).
2. Delete the placeholder content or build on top of it.
3. Import your custom UI components and services, and place them inside the page.

### Step 6: Test Your Code
Before saving, make sure there are no errors:
1. Check for typescript or styling issues:
   ```bash
   npm run lint
   ```
2. Build the project to make sure it compiles:
   ```bash
   npm run build
   ```

### Step 7: Push and Submit Your Work
1. Save your files:
   ```bash
   git add .
   ```
2. Commit your changes:
   ```bash
   git commit -m "feat(your-module): add list view and search input"
   ```
3. Push your branch:
   ```bash
   git push origin your-module-name/your-feature
   ```
4. Create a Pull Request (PR) on GitHub/GitLab. Developer 1 will review it, merge it, and integrate it into the main app shell and sidebar navigation.
