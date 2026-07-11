// TaskMaster - Application de gestion des tâches avec localStorage

class TaskManager {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.storageKey = 'moneyfan-tasks';
        
        // Éléments DOM
        this.taskInput = document.getElementById('taskInput');
        this.addBtn = document.getElementById('addBtn');
        this.tasksList = document.getElementById('tasksList');
        this.emptyMessage = document.getElementById('emptyMessage');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.clearCompletedBtn = document.getElementById('clearCompletedBtn');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        
        // Statistiques
        this.totalCount = document.getElementById('totalCount');
        this.activeCount = document.getElementById('activeCount');
        this.completedCount = document.getElementById('completedCount');
        
        this.init();
    }
    
    init() {
        // Charger les tâches du localStorage
        this.loadTasks();
        
        // Event listeners
        this.addBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        
        // Filtres
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target));
        });
        
        // Boutons d'action
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
        this.clearAllBtn.addEventListener('click', () => this.clearAll());
        
        // Afficher les tâches
        this.render();
    }
    
    // Ajouter une nouvelle tâche
    addTask() {
        const text = this.taskInput.value.trim();
        
        if (!text) {
            this.showNotification('⚠️ Veuillez entrer une tâche!');
            return;
        }
        
        if (text.length > 100) {
            this.showNotification('⚠️ La tâche est trop longue (max 100 caractères)');
            return;
        }
        
        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toLocaleDateString('fr-FR'),
            priority: 'medium' // par défaut
        };
        
        this.tasks.unshift(task);
        this.taskInput.value = '';
        this.taskInput.focus();
        this.saveTasks();
        this.render();
        this.showNotification('✅ Tâche ajoutée!');
    }
    
    // Basculer l'état d'une tâche
    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.render();
        }
    }
    
    // Supprimer une tâche
    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveTasks();
        this.render();
        this.showNotification('🗑️ Tâche supprimée!');
    }
    
    // Définir le filtre
    setFilter(btn) {
        // Retirer la classe active de tous les boutons
        this.filterBtns.forEach(b => b.classList.remove('active'));
        // Ajouter la classe active au bouton cliqué
        btn.classList.add('active');
        
        this.currentFilter = btn.dataset.filter;
        this.render();
    }
    
    // Filtrer les tâches
    getFilteredTasks() {
        switch(this.currentFilter) {
            case 'completed':
                return this.tasks.filter(t => t.completed);
            case 'active':
                return this.tasks.filter(t => !t.completed);
            default:
                return this.tasks;
        }
    }
    
    // Effacer les tâches complétées
    clearCompleted() {
        const completedCount = this.tasks.filter(t => t.completed).length;
        
        if (completedCount === 0) {
            this.showNotification('ℹ️ Aucune tâche à effacer');
            return;
        }
        
        if (confirm(`Êtes-vous sûr? (${completedCount} tâche(s))`)) {
            this.tasks = this.tasks.filter(t => !t.completed);
            this.saveTasks();
            this.render();
            this.showNotification('🧹 Tâches complétées effacées!');
        }
    }
    
    // Effacer tout
    clearAll() {
        if (this.tasks.length === 0) {
            this.showNotification('ℹ️ Aucune tâche à effacer');
            return;
        }
        
        if (confirm(`ATTENTION: Vous allez supprimer TOUTES les tâches (${this.tasks.length}). Êtes-vous sûr?`)) {
            this.tasks = [];
            this.saveTasks();
            this.render();
            this.showNotification('⚠️ Toutes les tâches ont été supprimées!');
        }
    }
    
    // Sauvegarder dans localStorage
    saveTasks() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
    }
    
    // Charger depuis localStorage
    loadTasks() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            try {
                this.tasks = JSON.parse(saved);
            } catch (e) {
                console.error('Erreur lors du chargement des tâches:', e);
                this.tasks = [];
            }
        }
    }
    
    // Mettre à jour les statistiques
    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const active = total - completed;
        
        this.totalCount.textContent = total;
        this.activeCount.textContent = active;
        this.completedCount.textContent = completed;
    }
    
    // Afficher les tâches
    render() {
        const filtered = this.getFilteredTasks();
        
        // Vider la liste
        this.tasksList.innerHTML = '';
        
        // Afficher le message vide si nécessaire
        if (this.tasks.length === 0) {
            this.emptyMessage.style.display = 'block';
        } else if (filtered.length === 0) {
            this.emptyMessage.innerHTML = '<p>📭 Aucune tâche avec ce filtre</p>';
            this.emptyMessage.style.display = 'block';
        } else {
            this.emptyMessage.style.display = 'none';
        }
        
        // Ajouter les tâches filtrées
        filtered.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <input 
                    type="checkbox" 
                    class="task-checkbox" 
                    ${task.completed ? 'checked' : ''}
                    data-id="${task.id}"
                >
                <span class="task-text">${this.escapeHtml(task.text)}</span>
                <span class="task-priority ${task.priority}">${task.priority}</span>
                <span class="task-date">${task.createdAt}</span>
                <button class="task-delete-btn" data-id="${task.id}">Supprimer</button>
            `;
            
            // Event listener pour le checkbox
            li.querySelector('.task-checkbox').addEventListener('change', () => {
                this.toggleTask(task.id);
            });
            
            // Event listener pour le bouton supprimer
            li.querySelector('.task-delete-btn').addEventListener('click', () => {
                this.deleteTask(task.id);
            });
            
            this.tasksList.appendChild(li);
        });
        
        // Mettre à jour les statistiques
        this.updateStats();
    }
    
    // Échapper les caractères HTML
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
    
    // Notification
    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease-in-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialiser l'application quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    new TaskManager();
    console.log('✅ TaskMaster chargé avec succès!');
});
