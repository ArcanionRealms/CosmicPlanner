// Cosmic Planner - Main JavaScript File
class CosmicPlanner {
    constructor() {
        this.currentTab = 'daily';
        this.currentEditingTask = null;
        this.currentEditingAnime = null;
        this.timezoneOffset = 4; // Default to GMT+4 (adjustable)
        this.settings = this.loadSettings();
        
        this.init();
    }

    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.initializeClock();
        this.loadData();
        this.setupDragAndDrop();
        this.createFloatingParticles();
        this.startTaskMigration();
        this.applySettings();
    }

    // Settings Management
    loadSettings() {
        const saved = localStorage.getItem('cosmicPlannerSettings');
        if (saved) {
            this.settings = JSON.parse(saved);
        } else {
            this.settings = {
                primaryGlow: '#00d4ff',
                secondaryGlow: '#ff0080',
                tertiaryGlow: '#80ff00',
                glowIntensity: 20,
                timezoneOffset: 4
            };
        }
        this.timezoneOffset = this.settings.timezoneOffset;
        return this.settings;
    }

    saveSettings() {
        localStorage.setItem('cosmicPlannerSettings', JSON.stringify(this.settings));
    }

    applySettings() {
        document.documentElement.style.setProperty('--primary-glow', this.settings.primaryGlow);
        document.documentElement.style.setProperty('--secondary-glow', this.settings.secondaryGlow);
        document.documentElement.style.setProperty('--tertiary-glow', this.settings.tertiaryGlow);
        document.documentElement.style.setProperty('--glow-intensity', `0 0 ${this.settings.glowIntensity}px`);
        
        // Update UI controls
        document.getElementById('primaryGlowColor').value = this.settings.primaryGlow;
        document.getElementById('secondaryGlowColor').value = this.settings.secondaryGlow;
        document.getElementById('tertiaryGlowColor').value = this.settings.tertiaryGlow;
        document.getElementById('glowIntensity').value = this.settings.glowIntensity;
        document.getElementById('glowValue').textContent = this.settings.glowIntensity;
        document.getElementById('timezoneOffset').value = this.settings.timezoneOffset;
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Add task buttons
        document.querySelectorAll('.add-task-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const day = e.target.closest('[data-day]').dataset.day;
                const priority = e.target.dataset.priority;
                this.openTaskModal('task', day, priority);
            });
        });

        // Add event buttons
        document.querySelectorAll('.add-event-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const day = e.target.closest('[data-day]').dataset.day;
                this.openTaskModal('event', day);
            });
        });

        // Modal controls
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTask();
        });

        document.getElementById('cancelTask').addEventListener('click', () => {
            this.closeTaskModal();
        });

        document.getElementById('animeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveAnime();
        });

        document.getElementById('cancelAnime').addEventListener('click', () => {
            this.closeAnimeModal();
        });

        // Add anime button
        document.getElementById('addAnimeBtn').addEventListener('click', () => {
            this.openAnimeModal();
        });

        // Settings button
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.toggleSettings();
        });

        // Settings controls
        document.getElementById('primaryGlowColor').addEventListener('change', (e) => {
            this.settings.primaryGlow = e.target.value;
            this.applySettings();
            this.saveSettings();
        });

        document.getElementById('secondaryGlowColor').addEventListener('change', (e) => {
            this.settings.secondaryGlow = e.target.value;
            this.applySettings();
            this.saveSettings();
        });

        document.getElementById('tertiaryGlowColor').addEventListener('change', (e) => {
            this.settings.tertiaryGlow = e.target.value;
            this.applySettings();
            this.saveSettings();
        });

        document.getElementById('glowIntensity').addEventListener('input', (e) => {
            this.settings.glowIntensity = parseInt(e.target.value);
            document.getElementById('glowValue').textContent = e.target.value;
            this.applySettings();
            this.saveSettings();
        });

        document.getElementById('timezoneOffset').addEventListener('change', (e) => {
            this.settings.timezoneOffset = parseInt(e.target.value);
            this.timezoneOffset = parseInt(e.target.value);
            this.saveSettings();
        });

        document.getElementById('resetSettings').addEventListener('click', () => {
            this.resetSettings();
        });

        // Close modals on outside click
        document.getElementById('taskModal').addEventListener('click', (e) => {
            if (e.target.id === 'taskModal') {
                this.closeTaskModal();
            }
        });

        document.getElementById('animeModal').addEventListener('click', (e) => {
            if (e.target.id === 'animeModal') {
                this.closeAnimeModal();
            }
        });
    }

    // Tab Management
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('tab-active');
            btn.classList.add('text-gray-300');
        });
        
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('tab-active');
        document.querySelector(`[data-tab="${tabName}"]`).classList.remove('text-gray-300');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });
        
        document.getElementById(`${tabName}-tab`).classList.remove('hidden');
        
        this.currentTab = tabName;
        
        // Load specific content for tabs
        if (tabName === 'weekly') {
            this.loadWeeklyView();
        } else if (tabName === 'monthly') {
            this.loadMonthlyView();
        } else if (tabName === 'anime') {
            this.loadAnimeView();
        }
    }

    // Clock Management
    initializeClock() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    }

    updateClock() {
        const now = new Date();
        const offsetTime = new Date(now.getTime() + (this.timezoneOffset * 60 * 60 * 1000));
        
        const timeString = offsetTime.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const dateString = offsetTime.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        document.getElementById('clock').textContent = timeString;
        document.getElementById('date').textContent = dateString;
    }

    // Task Management
    openTaskModal(type, day, priority = 'medium') {
        const modal = document.getElementById('taskModal');
        const title = document.getElementById('modalTitle');
        const daySelect = document.getElementById('taskDay');
        const prioritySelect = document.getElementById('taskPriority');
        const timeSelect = document.getElementById('timeSelectDiv');
        
        title.textContent = type === 'event' ? 'Add Event' : 'Add Task';
        daySelect.value = day;
        prioritySelect.value = priority;
        
        // Show/hide time input for events
        timeSelect.style.display = type === 'event' ? 'block' : 'none';
        
        modal.classList.remove('hidden');
        document.getElementById('taskTitle').focus();
    }

    closeTaskModal() {
        document.getElementById('taskModal').classList.add('hidden');
        document.getElementById('taskForm').reset();
        this.currentEditingTask = null;
    }

    saveTask() {
        const title = document.getElementById('taskTitle').value.trim();
        const description = document.getElementById('taskDescription').value.trim();
        const day = document.getElementById('taskDay').value;
        const priority = document.getElementById('taskPriority').value;
        const time = document.getElementById('eventTime').value;
        const recurring = document.getElementById('taskRecurring').checked;
        
        if (!title) return;

        const taskData = {
            id: this.currentEditingTask || Date.now().toString(),
            title,
            description,
            day,
            priority,
            time,
            recurring,
            completed: false,
            createdAt: new Date().toISOString()
        };

        if (this.currentEditingTask) {
            this.updateTask(taskData);
        } else {
            this.addTask(taskData);
        }

        this.closeTaskModal();
        this.saveData();
    }

    addTask(taskData) {
        const taskElement = this.createTaskElement(taskData);
        const taskList = document.querySelector(`[data-day="${taskData.day}"] .task-list[data-priority="${taskData.priority}"]`);
        taskList.appendChild(taskElement);
    }

    createTaskElement(taskData) {
        const taskDiv = document.createElement('div');
        taskDiv.className = `task-item priority-${taskData.priority} p-2 rounded border-l-4 cursor-grab`;
        taskDiv.dataset.taskId = taskData.id;
        taskDiv.draggable = true;

        const timeDisplay = taskData.time ? `<span class="text-xs text-purple-400">${taskData.time}</span>` : '';
        const recurringIcon = taskData.recurring ? '<span class="text-xs text-orange-400">🔄</span>' : '';
        
        taskDiv.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <div class="flex items-center space-x-2">
                        <input type="checkbox" ${taskData.completed ? 'checked' : ''} 
                               class="task-checkbox rounded" 
                               onchange="cosmicPlanner.toggleTaskCompletion('${taskData.id}')">
                        <span class="${taskData.completed ? 'line-through text-gray-500' : 'text-white'} text-sm font-medium">
                            ${taskData.title}
                        </span>
                        ${timeDisplay}
                        ${recurringIcon}
                    </div>
                    ${taskData.description ? `<p class="text-xs text-gray-400 mt-1">${taskData.description}</p>` : ''}
                </div>
                <div class="flex space-x-1">
                    <button onclick="cosmicPlanner.editTask('${taskData.id}')" 
                            class="text-blue-400 hover:text-blue-300 text-xs">✏️</button>
                    <button onclick="cosmicPlanner.deleteTask('${taskData.id}')" 
                            class="text-red-400 hover:text-red-300 text-xs">🗑️</button>
                </div>
            </div>
        `;

        return taskDiv;
    }

    toggleTaskCompletion(taskId) {
        const taskData = this.getTaskById(taskId);
        if (taskData) {
            taskData.completed = !taskData.completed;
            this.saveData();
            this.loadData();
        }
    }

    editTask(taskId) {
        const taskData = this.getTaskById(taskId);
        if (taskData) {
            this.currentEditingTask = taskId;
            document.getElementById('taskTitle').value = taskData.title;
            document.getElementById('taskDescription').value = taskData.description || '';
            document.getElementById('taskDay').value = taskData.day;
            document.getElementById('taskPriority').value = taskData.priority;
            document.getElementById('eventTime').value = taskData.time || '';
            document.getElementById('taskRecurring').checked = taskData.recurring || false;
            
            const modal = document.getElementById('taskModal');
            modal.classList.remove('hidden');
        }
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.removeTask(taskId);
            this.saveData();
            this.loadData();
        }
    }

    getTaskById(taskId) {
        const data = this.loadDataFromStorage();
        return data.tasks.find(task => task.id === taskId);
    }

    updateTask(updatedTask) {
        const data = this.loadDataFromStorage();
        const index = data.tasks.findIndex(task => task.id === updatedTask.id);
        if (index !== -1) {
            data.tasks[index] = updatedTask;
            localStorage.setItem('cosmicPlannerData', JSON.stringify(data));
        }
        this.loadData();
    }

    removeTask(taskId) {
        const data = this.loadDataFromStorage();
        data.tasks = data.tasks.filter(task => task.id !== taskId);
        localStorage.setItem('cosmicPlannerData', JSON.stringify(data));
    }

    // Anime Management
    openAnimeModal() {
        document.getElementById('animeModal').classList.remove('hidden');
        document.getElementById('animeTitle').focus();
    }

    closeAnimeModal() {
        document.getElementById('animeModal').classList.add('hidden');
        document.getElementById('animeForm').reset();
        this.currentEditingAnime = null;
    }

    saveAnime() {
        const title = document.getElementById('animeTitle').value.trim();
        const link = document.getElementById('animeLink').value.trim();
        const status = document.getElementById('animeStatus').value;
        const notes = document.getElementById('animeNotes').value.trim();
        
        if (!title) return;

        const animeData = {
            id: this.currentEditingAnime || Date.now().toString(),
            title,
            link,
            status,
            notes,
            addedAt: new Date().toISOString()
        };

        if (this.currentEditingAnime) {
            this.updateAnime(animeData);
        } else {
            this.addAnime(animeData);
        }

        this.closeAnimeModal();
        this.saveData();
        this.loadAnimeView();
    }

    addAnime(animeData) {
        const data = this.loadDataFromStorage();
        data.anime.push(animeData);
        localStorage.setItem('cosmicPlannerData', JSON.stringify(data));
    }

    createAnimeCard(animeData) {
        const card = document.createElement('div');
        card.className = 'anime-card rounded-lg p-4';
        card.dataset.animeId = animeData.id;

        const statusColors = {
            watching: 'text-green-400',
            completed: 'text-blue-400',
            planning: 'text-yellow-400',
            dropped: 'text-red-400'
        };

        const linkButton = animeData.link ? 
            `<a href="${animeData.link}" target="_blank" class="text-cyan-400 hover:text-cyan-300 text-xs">🔗 Watch</a>` : '';

        card.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <h4 class="text-white font-semibold text-sm">${animeData.title}</h4>
                <div class="flex space-x-1">
                    <button onclick="cosmicPlanner.editAnime('${animeData.id}')" 
                            class="text-blue-400 hover:text-blue-300 text-xs">✏️</button>
                    <button onclick="cosmicPlanner.deleteAnime('${animeData.id}')" 
                            class="text-red-400 hover:text-red-300 text-xs">🗑️</button>
                </div>
            </div>
            <div class="flex items-center space-x-2 mb-2">
                <span class="text-xs ${statusColors[animeData.status]}">${this.getStatusText(animeData.status)}</span>
                ${linkButton}
            </div>
            ${animeData.notes ? `<p class="text-xs text-gray-400">${animeData.notes}</p>` : ''}
        `;

        return card;
    }

    getStatusText(status) {
        const statusTexts = {
            watching: '👁️ Watching',
            completed: '✅ Completed',
            planning: '📝 Plan to Watch',
            dropped: '❌ Dropped'
        };
        return statusTexts[status] || status;
    }

    editAnime(animeId) {
        const animeData = this.getAnimeById(animeId);
        if (animeData) {
            this.currentEditingAnime = animeId;
            document.getElementById('animeTitle').value = animeData.title;
            document.getElementById('animeLink').value = animeData.link || '';
            document.getElementById('animeStatus').value = animeData.status;
            document.getElementById('animeNotes').value = animeData.notes || '';
            
            document.getElementById('animeModal').classList.remove('hidden');
        }
    }

    deleteAnime(animeId) {
        if (confirm('Are you sure you want to delete this anime?')) {
            this.removeAnime(animeId);
            this.saveData();
            this.loadAnimeView();
        }
    }

    getAnimeById(animeId) {
        const data = this.loadDataFromStorage();
        return data.anime.find(anime => anime.id === animeId);
    }

    updateAnime(updatedAnime) {
        const data = this.loadDataFromStorage();
        const index = data.anime.findIndex(anime => anime.id === updatedAnime.id);
        if (index !== -1) {
            data.anime[index] = updatedAnime;
            localStorage.setItem('cosmicPlannerData', JSON.stringify(data));
        }
    }

    removeAnime(animeId) {
        const data = this.loadDataFromStorage();
        data.anime = data.anime.filter(anime => anime.id !== animeId);
        localStorage.setItem('cosmicPlannerData', JSON.stringify(data));
    }

    // Data Management
    loadDataFromStorage() {
        const saved = localStorage.getItem('cosmicPlannerData');
        if (saved) {
            return JSON.parse(saved);
        }
        return { tasks: [], anime: [] };
    }

    saveData() {
        const data = {
            tasks: this.getAllTasks(),
            anime: this.getAllAnime()
        };
        localStorage.setItem('cosmicPlannerData', JSON.stringify(data));
    }

    getAllTasks() {
        const tasks = [];
        document.querySelectorAll('.task-item').forEach(taskEl => {
            const taskData = {
                id: taskEl.dataset.taskId,
                title: taskEl.querySelector('.text-white').textContent.trim(),
                description: taskEl.querySelector('.text-gray-400')?.textContent.trim() || '',
                day: taskEl.closest('[data-day]').dataset.day,
                priority: taskEl.classList.contains('priority-high') ? 'high' : 
                         taskEl.classList.contains('priority-medium') ? 'medium' : 'low',
                completed: taskEl.querySelector('.task-checkbox').checked,
                recurring: taskEl.querySelector('.text-orange-400') !== null
            };
            tasks.push(taskData);
        });
        return tasks;
    }

    getAllAnime() {
        const anime = [];
        document.querySelectorAll('.anime-card').forEach(card => {
            // This would need to be populated from storage since DOM doesn't contain all data
        });
        return this.loadDataFromStorage().anime;
    }

    loadData() {
        const data = this.loadDataFromStorage();
        
        // Clear existing tasks
        document.querySelectorAll('.task-list').forEach(list => {
            list.innerHTML = '';
        });
        
        // Load tasks
        data.tasks.forEach(taskData => {
            const taskElement = this.createTaskElement(taskData);
            const taskList = document.querySelector(`[data-day="${taskData.day}"] .task-list[data-priority="${taskData.priority}"]`);
            if (taskList) {
                taskList.appendChild(taskElement);
            }
        });
    }

    // Drag and Drop
    setupDragAndDrop() {
        document.querySelectorAll('.task-list').forEach(list => {
            new Sortable(list, {
                group: 'tasks',
                animation: 150,
                ghostClass: 'dragging',
                onEnd: (evt) => {
                    this.saveData();
                }
            });
        });
    }

    // Views
    loadWeeklyView() {
        const weeklyGrid = document.getElementById('weekly-grid');
        weeklyGrid.innerHTML = '';
        
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const data = this.loadDataFromStorage();
        
        days.forEach(day => {
            const dayTasks = data.tasks.filter(task => task.day === day);
            const dayElement = document.createElement('div');
            dayElement.className = 'cosmic-border rounded-lg p-4';
            
            let tasksHtml = '';
            dayTasks.forEach(task => {
                const priorityColor = task.priority === 'high' ? 'text-pink-400' : 
                                    task.priority === 'medium' ? 'text-cyan-400' : 'text-green-400';
                tasksHtml += `
                    <div class="flex items-center space-x-2 mb-1">
                        <input type="checkbox" ${task.completed ? 'checked' : ''} 
                               onchange="cosmicPlanner.toggleTaskCompletion('${task.id}')">
                        <span class="${task.completed ? 'line-through text-gray-500' : priorityColor} text-sm">
                            ${task.title}
                        </span>
                    </div>
                `;
            });
            
            dayElement.innerHTML = `
                <h3 class="orbitron text-lg font-bold text-white mb-3 capitalize">${day}</h3>
                ${tasksHtml || '<p class="text-gray-500 text-sm">No tasks</p>'}
            `;
            
            weeklyGrid.appendChild(dayElement);
        });
    }

    loadMonthlyView() {
        const calendar = document.getElementById('monthly-calendar');
        calendar.innerHTML = '';
        
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        const data = this.loadDataFromStorage();
        
        for (let i = 0; i < 42; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            
            const dayElement = document.createElement('div');
            dayElement.className = 'min-h-24 p-2 border border-gray-700 rounded';
            
            const isCurrentMonth = currentDate.getMonth() === now.getMonth();
            const isToday = currentDate.toDateString() === now.toDateString();
            
            if (!isCurrentMonth) {
                dayElement.classList.add('opacity-30');
            }
            
            if (isToday) {
                dayElement.classList.add('bg-cyan-500', 'bg-opacity-20');
            }
            
            const dayTasks = this.getTasksForDate(currentDate, data.tasks);
            let tasksHtml = '';
            
            dayTasks.slice(0, 3).forEach(task => {
                const priorityColor = task.priority === 'high' ? 'bg-pink-500' : 
                                    task.priority === 'medium' ? 'bg-cyan-500' : 'bg-green-500';
                tasksHtml += `<div class="${priorityColor} text-xs text-white rounded px-1 mb-1 truncate">${task.title}</div>`;
            });
            
            if (dayTasks.length > 3) {
                tasksHtml += `<div class="text-xs text-gray-400">+${dayTasks.length - 3} more</div>`;
            }
            
            dayElement.innerHTML = `
                <div class="text-sm font-semibold text-white mb-1">${currentDate.getDate()}</div>
                ${tasksHtml}
            `;
            
            calendar.appendChild(dayElement);
        }
    }

    getTasksForDate(date, allTasks) {
        const dayOfWeek = date.getDay();
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayName = dayNames[dayOfWeek];
        
        return allTasks.filter(task => task.day === dayName);
    }

    loadAnimeView() {
        const animeGrid = document.getElementById('anime-grid');
        animeGrid.innerHTML = '';
        
        const data = this.loadDataFromStorage();
        
        data.anime.forEach(animeData => {
            const animeCard = this.createAnimeCard(animeData);
            animeGrid.appendChild(animeCard);
        });
    }

    // Settings Panel
    toggleSettings() {
        const panel = document.getElementById('settingsPanel');
        panel.classList.toggle('hidden');
    }

    resetSettings() {
        this.settings = {
            primaryGlow: '#00d4ff',
            secondaryGlow: '#ff0080',
            tertiaryGlow: '#80ff00',
            glowIntensity: 20,
            timezoneOffset: 4
        };
        this.timezoneOffset = 4;
        this.saveSettings();
        this.applySettings();
    }

    // Task Migration
    startTaskMigration() {
        // Check for overdue tasks every hour
        setInterval(() => {
            this.migrateOverdueTasks();
        }, 60 * 60 * 1000);
        
        // Also check on app startup
        this.migrateOverdueTasks();
    }

    migrateOverdueTasks() {
        const data = this.loadDataFromStorage();
        const now = new Date();
        const currentDay = now.getDay();
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const todayName = dayNames[currentDay];
        
        // Migrate incomplete non-recurring tasks to today
        data.tasks.forEach(task => {
            if (!task.completed && !task.recurring && task.day !== todayName) {
                task.day = todayName;
            }
        });
        
        localStorage.setItem('cosmicPlannerData', JSON.stringify(data));
        this.loadData();
    }

    // Floating Particles
    createFloatingParticles() {
        const particlesContainer = document.getElementById('particles');
        
        setInterval(() => {
            if (document.querySelectorAll('.particle').length < 20) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
                particle.style.animationDelay = Math.random() * 2 + 's';
                
                // Random color from settings
                const colors = [this.settings.primaryGlow, this.settings.secondaryGlow, this.settings.tertiaryGlow];
                particle.style.background = colors[Math.floor(Math.random() * colors.length)];
                
                particlesContainer.appendChild(particle);
                
                // Remove particle after animation
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 8000);
            }
        }, 500);
    }
}

// Initialize the app
const cosmicPlanner = new CosmicPlanner();

// Handle page visibility changes to refresh data
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        cosmicPlanner.loadData();
        cosmicPlanner.migrateOverdueTasks();
    }
});

// Handle window focus to refresh data
window.addEventListener('focus', () => {
    cosmicPlanner.loadData();
    cosmicPlanner.migrateOverdueTasks();
});

// Handle clicks outside settings panel to close it
document.addEventListener('click', (e) => {
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsPanel = document.getElementById('settingsPanel');
    
    if (!settingsBtn.contains(e.target) && !settingsPanel.contains(e.target)) {
        settingsPanel.classList.add('hidden');
    }
});

// Prevent dragging of images and links
document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'A') {
        e.preventDefault();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape key closes modals
    if (e.key === 'Escape') {
        cosmicPlanner.closeTaskModal();
        cosmicPlanner.closeAnimeModal();
        document.getElementById('settingsPanel').classList.add('hidden');
    }
    
    // Ctrl/Cmd + N opens new task modal
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        cosmicPlanner.openTaskModal('task', 'monday', 'medium');
    }
    
    // Ctrl/Cmd + A opens anime modal
    if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        cosmicPlanner.openAnimeModal();
    }
});

// Service Worker Registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}