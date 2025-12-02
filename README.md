# 🌌 Cosmic Planner

A sophisticated daily planner application with sci-fi aesthetics, featuring task management, event scheduling, weekly/monthly views, and anime tracking capabilities.

## ✨ Features

### 📝 Daily Planning
- **Priority-based task management** (High, Medium, Low priority)
- **Drag & drop task reordering** within and between priority levels
- **Event scheduling** with time management
- **Recurring tasks** that repeat weekly
- **Automatic task migration** - incomplete tasks move to the next day

### 📅 Calendar Views
- **Daily view** with 7-day layout
- **Weekly overview** showing all tasks for the week
- **Monthly calendar** with task indicators

### 🎌 Anime Tracker
- **Add and manage anime titles** you're watching
- **Track viewing status** (Watching, Completed, Plan to Watch, Dropped)
- **Store streaming links** for easy access
- **Add personal notes** for each anime

### 🕒 Real-time Features
- **Live clock** with configurable timezone (default GMT+4)
- **Automatic task migration** for incomplete tasks
- **Persistent data storage** - everything saves automatically

### 🎨 Sci-fi Aesthetics
- **Cosmic background** with animated floating particles
- **Glowing UI elements** with customizable colors
- **Futuristic fonts** and typography
- **Smooth animations** and transitions

### ⚙️ Customizable Settings
- **Color customization** for glow effects
- **Glow intensity** adjustment
- **Timezone configuration**
- **UI theme controls** for non-technical users

## 🚀 Installation & Usage

### Web Version (Instant Access)
Simply open `index.html` in any modern web browser. No installation required!

### Desktop Version

#### Method 1: Python Server (Recommended)
1. Ensure Python 3.x is installed on your system
2. Navigate to the Cosmic Planner directory
3. Run the server:
   ```bash
   python server.py
   ```
4. The app will automatically open in your default browser
5. Access it anytime at `http://localhost:8000`

#### Method 2: Direct Browser Access
1. Open `index.html` directly in your browser
2. Note: Some features may be limited due to browser security restrictions

#### Method 3: Local HTTP Server
Using Python's built-in server:
```bash
python -m http.server 8000
```
Then open `http://localhost:8000`

Using Node.js (if available):
```bash
npx serve .
```

## 🎯 How to Use

### Adding Tasks
1. Click the **"+ Add Task"** button in any priority section
2. Fill in the task details:
   - Title (required)
   - Description (optional)
   - Priority level
   - Day of the week
   - Set as recurring if needed
3. Click **Save**

### Managing Tasks
- **Check the checkbox** to mark tasks as complete
- **Drag and drop** to reorder tasks within priority levels
- **Click the edit button (✏️)** to modify task details
- **Click the delete button (🗑️)** to remove tasks

### Adding Events
1. Click the **"+ Add Event"** button in any day's event section
2. Fill in event details including time
3. Events will appear with a clock icon (🕒)

### Tracking Anime
1. Switch to the **Anime Tracker** tab
2. Click **"+ Add Anime"**
3. Enter anime details:
   - Title (required)
   - Streaming link (optional)
   - Current viewing status
   - Personal notes (optional)
4. Click **Save**

### Customizing the Interface
1. Click the **⚙️ Settings** button in the header
2. Adjust colors using the color pickers
3. Modify glow intensity with the slider
4. Change timezone if needed
5. Changes apply instantly and save automatically

## ⌨️ Keyboard Shortcuts

- **Ctrl/Cmd + N**: Open new task modal
- **Ctrl/Cmd + A**: Open anime tracker modal
- **Escape**: Close any open modal

## 📊 Data Storage

All your data is stored locally in your browser using **LocalStorage**:
- Tasks and events are automatically saved
- Anime tracking data persists between sessions
- Settings and preferences are remembered
- **No data is sent to external servers** - everything stays private

## 🔧 Technical Details

### Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Technologies Used
- **HTML5** with semantic structure
- **CSS3** with modern features (Grid, Flexbox, Custom Properties)
- **Vanilla JavaScript** (no external dependencies)
- **Tailwind CSS** for styling
- **SortableJS** for drag-and-drop functionality
- **Web Fonts** (Orbitron, Exo 2) for sci-fi aesthetics

### File Structure
```
cosmic-planner/
├── index.html          # Main application file
├── main.js            # Core JavaScript functionality
├── server.py          # Desktop server launcher
├── manifest.json      # App manifest for desktop version
└── README.md          # This file
```

## 🎨 Customization Guide

### Changing Colors
1. Open Settings (⚙️)
2. Use the color pickers to select your preferred glow colors:
   - Primary glow (main UI elements)
   - Secondary glow (accents and highlights)
   - Tertiary glow (anime tracker theme)

### Adjusting Glow Intensity
1. Open Settings (⚙️)
2. Use the glow intensity slider (5-30 pixels)
3. Find the perfect balance for your preference

### Setting Timezone
1. Open Settings (⚙️)
2. Select your timezone from the dropdown
3. The clock will update immediately

## 🐛 Troubleshooting

### App won't load
- Ensure all files are in the same directory
- Try using the Python server method
- Check browser console for error messages

### Data not saving
- Ensure browser allows LocalStorage
- Check if you're in private/incognito mode
- Try refreshing the page

### Drag and drop not working
- Ensure JavaScript is enabled
- Try clicking and holding for 1 second before dragging
- Check if any browser extensions are interfering

### Clock showing wrong time
- Adjust timezone in Settings
- Ensure your system time is correct
- Refresh the page to sync

## 🌟 Tips & Tricks

1. **Use recurring tasks** for daily routines like exercise or meditation
2. **Color-code your priorities** - the visual system helps with quick recognition
3. **Set specific times for events** to better organize your day
4. **Use the weekly view** to get a bird's eye view of your upcoming tasks
5. **Track anime progress** by updating the status as you watch
6. **Customize the glow colors** to match your personal style
7. **Use keyboard shortcuts** for faster task creation

## 🔮 Future Enhancements

Potential features that may be added:
- Task categories and tags
- Progress statistics and analytics
- Export/import functionality
- Multiple theme presets
- Sound notifications
- Mobile app version
- Cloud sync capabilities

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to fork, modify, and improve the Cosmic Planner. Pull requests and suggestions are welcome!

---

**🌌 Navigate Your Universe with Cosmic Planner! 🌌**