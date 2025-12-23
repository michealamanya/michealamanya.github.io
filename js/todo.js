// Todo App JavaScript
class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.nextId = 1;
        
        this.init();
    }
    
    init() {
        this.loadFromStorage();
        this.bindEvents();
        this.render();
        this.hideLoading();
    }
    
    bindEvents() {
        // Form submission
        const todoForm = document.getElementById('todoForm');
        todoForm.addEventListener('submit', (e) => this.handleAddTodo(e));
        
        // Filter tabs
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
            tab.addEventListener('click', (e) => this.handleFilterChange(e));
        });
        
        // Menu button
        const menuBtn = document.getElementById('menuBtn');
        const menuDropdown = document.getElementById('menuDropdown');
        menuBtn.addEventListener('click', () => this.toggleMenu());
        
        // Menu actions
        document.getElementById('clearCompleted').addEventListener('click', () => this.clearCompleted());
        document.getElementById('clearAll').addEventListener('click', () => this.clearAll());
        document.getElementById('exportData').addEventListener('click', () => this.exportData());
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuBtn.contains(e.target) && !menuDropdown.contains(e.target)) {
                menuDropdown.classList.remove('show');
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Touch gestures for mobile
        this.bindTouchEvents();
    }
    
    bindTouchEvents() {
        let startX = null;
        let startY = null;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;
            
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            
            const diffX = startX - currentX;
            const diffY = startY - currentY;
            
            // Prevent default if horizontal swipe is detected
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
                e.preventDefault();
            }
        });
        
        document.addEventListener('touchend', (e) => {
            startX = null;
            startY = null;
        });
    }
    
    handleAddTodo(e) {
        e.preventDefault();
        const input = document.getElementById('todoInput');
        const text = input.value.trim();
        
        if (!text) {
            this.showToast('Please enter a task', 'warning');
            return;
        }
        
        if (text.length > 200) {
            this.showToast('Task is too long (max 200 characters)', 'error');
            return;
        }
        
        const todo = {
            id: this.nextId++,
            text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        this.todos.unshift(todo);
        input.value = '';
        this.saveToStorage();
        this.render();
        this.showToast('Task added successfully!', 'success');
    }
    
    handleFilterChange(e) {
        const filter = e.target.dataset.filter;
        this.currentFilter = filter;
        
        // Update active tab
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        e.target.classList.add('active');
        
        this.render();
    }
    
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            todo.completedAt = todo.completed ? new Date().toISOString() : null;
            this.saveToStorage();
            this.render();
            
            const message = todo.completed ? 'Task completed!' : 'Task marked as pending';
            const type = todo.completed ? 'success' : 'info';
            this.showToast(message, type);
        }
    }
    
    deleteTodo(id) {
        const todoIndex = this.todos.findIndex(t => t.id === id);
        if (todoIndex > -1) {
            this.todos.splice(todoIndex, 1);
            this.saveToStorage();
            this.render();
            this.showToast('Task deleted', 'info');
        }
    }
    
    editTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;
        
        const newText = prompt('Edit task:', todo.text);
        if (newText !== null && newText.trim()) {
            const trimmedText = newText.trim();
            if (trimmedText.length > 200) {
                this.showToast('Task is too long (max 200 characters)', 'error');
                return;
            }
            
            todo.text = trimmedText;
            todo.updatedAt = new Date().toISOString();
            this.saveToStorage();
            this.render();
            this.showToast('Task updated!', 'success');
        }
    }
    
    clearCompleted() {
        const completedCount = this.todos.filter(t => t.completed).length;
        if (completedCount === 0) {
            this.showToast('No completed tasks to clear', 'info');
            return;
        }
        
        if (confirm(`Delete ${completedCount} completed task(s)?`)) {
            this.todos = this.todos.filter(t => !t.completed);
            this.saveToStorage();
            this.render();
            this.showToast(`${completedCount} task(s) cleared`, 'success');
        }
        this.toggleMenu();
    }
    
    clearAll() {
        if (this.todos.length === 0) {
            this.showToast('No tasks to clear', 'info');
            return;
        }
        
        if (confirm(`Delete all ${this.todos.length} task(s)?`)) {
            this.todos = [];
            this.saveToStorage();
            this.render();
            this.showToast('All tasks cleared', 'success');
        }
        this.toggleMenu();
    }
    
    exportData() {
        if (this.todos.length === 0) {
            this.showToast('No tasks to export', 'info');
            return;
        }
        
        const data = {
            todos: this.todos,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { 
            type: 'application/json' 
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `todos-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showToast('Tasks exported successfully!', 'success');
        this.toggleMenu();
    }
    
    toggleMenu() {
        const menu = document.getElementById('menuDropdown');
        menu.classList.toggle('show');
    }
    
    handleKeyboard(e) {
        // Escape key closes menu
        if (e.key === 'Escape') {
            document.getElementById('menuDropdown').classList.remove('show');
        }
        
        // Enter key focuses input when not in input
        if (e.key === 'Enter' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
            document.getElementById('todoInput').focus();
        }
    }
    
    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'completed':
                return this.todos.filter(t => t.completed);
            case 'pending':
                return this.todos.filter(t => !t.completed);
            default:
                return this.todos;
        }
    }
    
    render() {
        this.updateStats();
        this.renderTodoList();
    }
    
    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const pending = total - completed;
        
        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('pendingTasks').textContent = pending;
    }
    
    renderTodoList() {
        const todoList = document.getElementById('todoList');
        const emptyState = document.getElementById('emptyState');
        const filteredTodos = this.getFilteredTodos();
        
        if (filteredTodos.length === 0) {
            todoList.innerHTML = '';
            emptyState.classList.add('show');
            return;
        }
        
        emptyState.classList.remove('show');
        todoList.innerHTML = filteredTodos.map(todo => this.renderTodoItem(todo)).join('');
        
        // Bind events to new elements
        this.bindTodoEvents();
    }
    
    renderTodoItem(todo) {
        const timeAgo = this.getTimeAgo(todo.createdAt);
        const checkIcon = todo.completed ? '<i class="fas fa-check"></i>' : '';
        
        return `
            <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                <div class="todo-content">
                    <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" 
                         onclick="app.toggleTodo(${todo.id})">
                        ${checkIcon}
                    </div>
                    <div class="todo-text">${this.escapeHtml(todo.text)}</div>
                    <div class="todo-actions">
                        <button class="todo-action edit" onclick="app.editTodo(${todo.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="todo-action delete" onclick="app.deleteTodo(${todo.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    bindTodoEvents() {
        // Add swipe-to-delete functionality for mobile
        const todoItems = document.querySelectorAll('.todo-item');
        todoItems.forEach(item => {
            let startX = null;
            let currentX = null;
            let isDragging = false;
            
            item.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
            });
            
            item.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                
                currentX = e.touches[0].clientX;
                const diffX = startX - currentX;
                
                if (diffX > 50) {
                    item.style.transform = `translateX(-${Math.min(diffX, 100)}px)`;
                    item.style.opacity = Math.max(1 - diffX / 200, 0.5);
                }
            });
            
            item.addEventListener('touchend', (e) => {
                if (!isDragging) return;
                
                const diffX = startX - currentX;
                if (diffX > 100) {
                    const id = parseInt(item.dataset.id);
                    this.deleteTodo(id);
                } else {
                    item.style.transform = '';
                    item.style.opacity = '';
                }
                
                startX = null;
                currentX = null;
                isDragging = false;
            });
        });
    }
    
    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = '';
        switch (type) {
            case 'success':
                icon = 'fas fa-check-circle';
                break;
            case 'error':
                icon = 'fas fa-exclamation-circle';
                break;
            case 'warning':
                icon = 'fas fa-exclamation-triangle';
                break;
            default:
                icon = 'fas fa-info-circle';
        }
        
        toast.innerHTML = `
            <i class="${icon}"></i>
            <span>${this.escapeHtml(message)}</span>
        `;
        
        container.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Hide and remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (container.contains(toast)) {
                    container.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
    
    getTimeAgo(dateString) {
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString();
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    saveToStorage() {
        try {
            const data = {
                todos: this.todos,
                nextId: this.nextId,
                version: '1.0'
            };
            localStorage.setItem('todoApp', JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
            this.showToast('Failed to save tasks', 'error');
        }
    }
    
    loadFromStorage() {
        try {
            const data = localStorage.getItem('todoApp');
            if (data) {
                const parsed = JSON.parse(data);
                this.todos = parsed.todos || [];
                this.nextId = parsed.nextId || 1;
                
                // Ensure nextId is always higher than existing IDs
                const maxId = this.todos.reduce((max, todo) => Math.max(max, todo.id), 0);
                this.nextId = Math.max(this.nextId, maxId + 1);
            }
        } catch (error) {
            console.error('Failed to load from localStorage:', error);
            this.showToast('Failed to load saved tasks', 'error');
        }
    }
    
    hideLoading() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            loadingScreen.classList.add('hide');
            
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 300);
        }, 1000);
    }
}

// PWA functionality
class PWAInstaller {
    constructor() {
        this.deferredPrompt = null;
        this.init();
    }
    
    init() {
        // Listen for the beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallPrompt();
        });
        
        // Listen for successful installation
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            this.hideInstallPrompt();
        });
        
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            console.log('App is running in standalone mode');
        }
    }
    
    showInstallPrompt() {
        // Create install prompt
        const prompt = document.createElement('div');
        prompt.className = 'install-prompt show';
        prompt.innerHTML = `
            <span>Install this app on your device for a better experience!</span>
            <button class="install-btn" onclick="pwaInstaller.install()">Install</button>
            <button class="install-btn" onclick="pwaInstaller.dismissPrompt()" style="margin-left: 0.25rem; background: rgba(255,255,255,0.1);">×</button>
        `;
        
        document.body.insertBefore(prompt, document.body.firstChild);
        this.installPrompt = prompt;
    }
    
    hideInstallPrompt() {
        if (this.installPrompt) {
            this.installPrompt.remove();
            this.installPrompt = null;
        }
    }
    
    async install() {
        if (!this.deferredPrompt) return;
        
        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        
        console.log(`User response to install prompt: ${outcome}`);
        this.deferredPrompt = null;
        this.hideInstallPrompt();
    }
    
    dismissPrompt() {
        this.hideInstallPrompt();
        this.deferredPrompt = null;
    }
}

// Initialize app
let app;
let pwaInstaller;

document.addEventListener('DOMContentLoaded', () => {
    app = new TodoApp();
    pwaInstaller = new PWAInstaller();
});

// Service Worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('ServiceWorker registration successful');
        } catch (error) {
            console.log('ServiceWorker registration failed: ', error);
        }
    });
}