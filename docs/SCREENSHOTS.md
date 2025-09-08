# Screenshots Guide

## How to Take App Screenshots

1. **Start the app**: The development server should be running (`npm run dev`)
2. **Wait for Electron window**: The app should open automatically
3. **Take screenshots** of these key areas:

### Required Screenshots

1. **Dashboard/Main View** (`dashboard.png`)
   - Show the main interface with Arabic text
   - Include the HayatiLogo and sidebar
   - Capture both task and habit sections if visible

2. **Tasks Page** (`tasks.png`) 
   - Navigate to Tasks page
   - Show task creation/management interface
   - Display Arabic RTL layout

3. **Habits Page** (`habits.png`)
   - Navigate to Habits page  
   - Show habit tracking interface
   - Capture streak indicators if available

4. **Prayer Times** (`prayers.png`)
   - Navigate to Prayer Times page
   - Show prayer schedule and Islamic calendar
   - Display location-based prayer times

### Screenshot Tips

- Use **1920x1080** resolution if possible
- Ensure **Arabic text is clearly visible**
- **Dark theme** screenshots look more professional
- Show the **Hayati logo** and branding
- Capture **RTL layout** properly
- Include **notification examples** if possible

### File Naming

Save screenshots as:
- `dashboard.png` - Main dashboard view
- `tasks.png` - Task management page  
- `habits.png` - Habit tracking page
- `prayers.png` - Prayer times page

### Adding to Repository

1. Save screenshots to: `docs/screenshots/`
2. Commit them: `git add docs/screenshots/ && git commit -m "docs: add app screenshots"`
3. Update README.md to reference the screenshots

The screenshots will make the project look much more professional and help users understand what the app does.
