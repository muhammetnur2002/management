// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Обновление времени в реальном времени
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ru-RU', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        const dateString = now.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            timeElement.textContent = `${dateString} | ${timeString}`;
        }
    }
    
    // Обновляем время каждую секунду
    updateTime();
    setInterval(updateTime, 1000);
    
    // Создание маркеров на временной оси
    createTimelineMarkers();
    
    // Создание задач Ганта
    createGanttTasks();
    
    // Анимация сканирующей линии
    animateScanLine();
    
    // Добавляем эффекты наведения
    addHoverEffects();
    
    // Пульсация критических элементов
    animateCriticalElements();
    
    // Добавляем эффект шума
    addNoiseEffect();
    
    // Настройка навигации
    setupNavigation();
    
    // Анимация для кнопки перехода к таблице
    animateTableButton();
});

// Настройка навигации
function setupNavigation() {
    // Кнопка экспорта
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            // Здесь можно добавить функционал экспорта
            alert('Функция экспорта будет реализована в следующем обновлении');
        });
    }
    
    // Кнопка аналитики
    const analyticsBtn = document.getElementById('analyticsBtn');
    if (analyticsBtn) {
        analyticsBtn.addEventListener('click', function() {
            // Здесь можно добавить функционал аналитики
            alert('Аналитика проекта будет доступна после запуска кампании');
        });
    }
    
    // Кнопка Ганта
    const ganttBtn = document.getElementById('ganttBtn');
    if (ganttBtn) {
        ganttBtn.addEventListener('click', function() {
            // Прокрутка к Гант-диаграмме
            const ganttSection = document.querySelector('.gantt-blueprint');
            if (ganttSection) {
                ganttSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Кнопка главной
    const dashboardBtn = document.getElementById('dashboardBtn');
    if (dashboardBtn) {
        dashboardBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// Анимация кнопки перехода к таблице
function animateTableButton() {
    const tableButtons = document.querySelectorAll('a[href="table.html"]');
    
    tableButtons.forEach(button => {
        // Пульсация для активной кнопки в навигации
        if (button.classList.contains('active')) {
            setInterval(() => {
                button.style.boxShadow = button.style.boxShadow === '' 
                    ? '0 0 15px rgba(0, 255, 136, 0.5)' 
                    : '';
            }, 1000);
        }
        
        // Анимация для CTA-кнопки
        if (button.classList.contains('cta-button') || button.classList.contains('quick-btn')) {
            setInterval(() => {
                button.style.transform = button.style.transform === 'translateY(-3px) scale(1.02)' 
                    ? 'translateY(-3px) scale(1)' 
                    : 'translateY(-3px) scale(1.02)';
            }, 2000);
        }
    });
}

// Создание маркеров на временной оси
function createTimelineMarkers() {
    const timeMarkers = document.querySelector('.time-markers');
    if (!timeMarkers) return;
    
    // Очищаем существующие маркеры
    timeMarkers.innerHTML = '';
    
    // Создаем 28 маркеров (по дням)
    for (let i = 1; i <= 28; i++) {
        const marker = document.createElement('div');
        marker.className = 'time-marker';
        marker.style.position = 'absolute';
        marker.style.left = `${(i - 1) * (100 / 27)}%`;
        marker.style.top = '50%';
        marker.style.transform = 'translateX(-50%) translateY(-50%)';
        
        // Основная линия
        const line = document.createElement('div');
        line.style.width = '1px';
        line.style.height = i % 7 === 0 ? '20px' : '10px';
        line.style.backgroundColor = i % 7 === 0 ? '#00ff88' : 'rgba(0, 255, 255, 0.5)';
        
        // Метка дня
        const label = document.createElement('div');
        label.textContent = i;
        label.style.fontFamily = "'Share Tech Mono', monospace";
        label.style.fontSize = '0.7rem';
        label.style.color = i % 7 === 0 ? '#00ff88' : 'rgba(0, 255, 255, 0.7)';
        label.style.position = 'absolute';
        label.style.top = i % 7 === 0 ? '-25px' : '-15px';
        label.style.left = '50%';
        label.style.transform = 'translateX(-50%)';
        label.style.whiteSpace = 'nowrap';
        
        // Подпись недели для каждого 7-го дня
        if (i % 7 === 0) {
            const weekLabel = document.createElement('div');
            const weekNumber = Math.floor(i / 7);
            weekLabel.textContent = `НЕДЕЛЯ ${weekNumber}`;
            weekLabel.style.fontFamily = "'Share Tech Mono', monospace";
            weekLabel.style.fontSize = '0.6rem';
            weekLabel.style.color = 'rgba(0, 255, 255, 0.5)';
            weekLabel.style.position = 'absolute';
            weekLabel.style.top = '-40px';
            weekLabel.style.left = '50%';
            weekLabel.style.transform = 'translateX(-50%)';
            marker.appendChild(weekLabel);
        }
        
        marker.appendChild(line);
        marker.appendChild(label);
        timeMarkers.appendChild(marker);
    }
}

// Создание задач Ганта
function createGanttTasks() {
    const ganttContainer = document.getElementById('gantt-tasks');
    if (!ganttContainer) return;
    
    // Задачи для Ганта
    const tasks = [
        // Подготовка (желтый)
        { id: 1, name: "1. Стратегия, Брифинг", start: 1, duration: 2, color: "#4ade80", critical: false },
        { id: 2, name: "2. LP + Лид-магнит", start: 1, duration: 4, color: "#4ade80", critical: false },
        { id: 3, name: "3. Производство Креативов", start: 3, duration: 4, color: "#4ade80", critical: false },
        { id: 4, name: "4. СОГЛАСОВАНИЕ КРЕАТИВОВ", start: 6, duration: 2, color: "#4ade80", critical: true },
        
        // Тестирование (синий)
        { id: 5, name: "5. Финальный Монтаж", start: 8, duration: 2, color: "#4ade80", critical: false },
        { id: 6, name: "6. Запуск Тестов Ads", start: 8, duration: 3, color: "#4ade80", critical: false },
        { id: 7, name: "7. PR: Статья в медиа", start: 10, duration: 4, color: "#4ade80", critical: false },
        { id: 8, name: "8. 1-й Influencer", start: 12, duration: 3, color: "#4ade80", critical: false },
        { id: 9, name: "9. Сбор базы лидов", start: 8, duration: 7, color: "#4ade80", critical: false },
        
        // Масштабирование (зеленый)
        { id: 10, name: "10. МАСШТАБИРОВАНИЕ Ads", start: 15, duration: 14, color: "#4ade80", critical: false },
        { id: 11, name: "11. Рассылка по базе", start: 15, duration: 14, color: "#4ade80", critical: false },
        { id: 12, name: "12. 2-й Influencer", start: 18, duration: 4, color: "#4ade80", critical: false },
        { id: 13, name: "13. Community Management", start: 15, duration: 14, color: "#4ade80", critical: false },
        
        // Финальный пуш (красный)
        { id: 14, name: "14. ФИНАЛЬНЫЙ ОФФЕР", start: 25, duration: 4, color: "#4ade80", critical: true },
        { id: 15, name: "15. Анализ и Отчет", start: 28, duration: 1, color: "#4ade80", critical: false }
    ];
    
    // Очищаем контейнер
    ganttContainer.innerHTML = '';
    
    // Высота контейнера и отступы
    const containerHeight = 300;
    const taskHeight = 30;
    const verticalSpacing = 10;
    
    // Распределяем задачи по вертикали
    tasks.forEach((task, index) => {
        const taskElement = document.createElement('div');
        taskElement.className = `gantt-task ${task.critical ? 'critical' : ''}`;
        
        // Позиционирование по горизонтали (шкала 28 дней = 100%)
        const left = ((task.start - 1) / 28) * 100;
        const width = (task.duration / 28) * 100;
        
        // Позиционирование по вертикали
        const top = index * (taskHeight + verticalSpacing);
        
        // Устанавливаем стили
        taskElement.style.left = `${left}%`;
        taskElement.style.width = `${width}%`;
        taskElement.style.top = `${top}px`;
        taskElement.style.color = task.color;
        taskElement.style.borderColor = task.color;
        
        // Добавляем номер и название
        const taskText = document.createElement('span');
        taskText.textContent = task.name;
        taskElement.appendChild(taskText);
        
        // Добавляем индикатор критичности
        if (task.critical) {
            const criticalIcon = document.createElement('i');
            criticalIcon.className = 'fas fa-exclamation-circle';
            criticalIcon.style.marginLeft = '0.5rem';
            criticalIcon.style.color = '#ff4444';
            taskElement.appendChild(criticalIcon);
        }
        
        // Добавляем всплывающую подсказку
        taskElement.title = `${task.name}\nНачало: день ${task.start}\nДлительность: ${task.duration} дней`;
        
        ganttContainer.appendChild(taskElement);
    });
    
    // Настраиваем высоту контейнера
    const totalHeight = tasks.length * (taskHeight + verticalSpacing) + 50;
    ganttContainer.style.height = `${totalHeight}px`;
}

// Анимация сканирующей линии
function animateScanLine() {
    const scanLine = document.querySelector('.scan-line');
    if (!scanLine) return;
    
    // Случайное смещение для "естественного" движения
    let offset = 0;
    setInterval(() => {
        offset = (offset + 0.5) % 100;
        scanLine.style.background = `linear-gradient(90deg, 
            transparent, 
            #00ff88 ${offset - 10}%, 
            #00ff88 ${offset}%, 
            transparent ${offset + 10}%)`;
    }, 50);
}

// Добавление эффектов наведения
function addHoverEffects() {
    // Эффект для метрик
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.metric-icon i');
            if (icon) {
                icon.style.transform = 'scale(1.2)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.metric-icon i');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
    });
    
    // Эффект для карточек предпросмотра
    const summaryCards = document.querySelectorAll('.summary-card');
    summaryCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.summary-icon i');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.summary-icon i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
    
    // Эффект для строк предпросмотра
    const previewRows = document.querySelectorAll('.preview-row:not(.header)');
    previewRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.background = 'rgba(91, 110, 110, 0.05)';
            row.style.transform = 'translateX(5px)';
            row.style.transition = 'all 0.3s ease';
        });
        
        row.addEventListener('mouseleave', () => {
            if (!row.classList.contains('critical')) {
                row.style.background = '';
            }
            row.style.transform = 'translateX(0)';
        });
    });
}

// Анимация критических элементов
function animateCriticalElements() {
    // Мигание критических статусов в предпросмотре
    const criticalBadges = document.querySelectorAll('.status-badge.critical');
    setInterval(() => {
        criticalBadges.forEach(badge => {
            badge.style.opacity = badge.style.opacity === '0.7' ? '1' : '0.7';
        });
    }, 500);
    
    // Пульсация критической строки
    const criticalRow = document.querySelector('.preview-row.critical');
    if (criticalRow) {
        setInterval(() => {
            criticalRow.style.borderLeftColor = 
                criticalRow.style.borderLeftColor === 'var(--error-red)' 
                ? 'var(--warning-yellow)' 
                : 'var(--error-red)';
        }, 1000);
    }
    
    // Анимация светодиодов статуса
    const leds = document.querySelectorAll('.led');
    setInterval(() => {
        leds.forEach(led => {
            if (led.classList.contains('warning')) {
                led.style.boxShadow = 
                    led.style.boxShadow === '0 0 10px var(--warning-yellow)'
                    ? '0 0 20px var(--warning-yellow)'
                    : '0 0 10px var(--warning-yellow)';
            } else {
                led.style.boxShadow = 
                    led.style.boxShadow === '0 0 10px var(--primary-green)'
                    ? '0 0 20px var(--primary-green)'
                    : '0 0 10px var(--primary-green)';
            }
        });
    }, 1000);
}

// Функция для генерации шума (эффект помех)
function addNoiseEffect() {
    const noiseOverlay = document.createElement('div');
    noiseOverlay.className = 'noise-overlay';
    noiseOverlay.style.position = 'fixed';
    noiseOverlay.style.top = '0';
    noiseOverlay.style.left = '0';
    noiseOverlay.style.width = '100%';
    noiseOverlay.style.height = '100%';
    noiseOverlay.style.pointerEvents = 'none';
    noiseOverlay.style.zIndex = '998';
    noiseOverlay.style.opacity = '0.02';
    noiseOverlay.style.backgroundImage = `
        url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")
    `;
    noiseOverlay.style.animation = 'noise 0.2s steps(10) infinite';
    
    document.body.appendChild(noiseOverlay);
    
    // Добавляем CSS для анимации шума
    const style = document.createElement('style');
    style.textContent = `
        @keyframes noise {
            0% { transform: translate(0,0); }
            10% { transform: translate(-5%,-5%); }
            20% { transform: translate(-10%,5%); }
            30% { transform: translate(5%,-10%); }
            40% { transform: translate(-5%,15%); }
            50% { transform: translate(-10%,5%); }
            60% { transform: translate(15%,0); }
            70% { transform: translate(0,10%); }
            80% { transform: translate(-15%,0); }
            90% { transform: translate(10%,5%); }
            100% { transform: translate(5%,0); }
        }
    `;
    document.head.appendChild(style);
}

// Показать уведомление
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        border: 1px solid var(--border-glow);
        border-radius: 5px;
        padding: 15px 20px;
        color: var(--text-primary);
        font-family: 'Rajdhani', sans-serif;
        display: flex;
        align-items: center;
        gap: 15px;
        z-index: 10001;
        backdrop-filter: blur(10px);
        animation: slideInUp 0.3s ease;
        max-width: 400px;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideOutDown {
            from { transform: translateY(0); opacity: 1; }
            to { transform: translateY(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Автоматическое закрытие через 3 секунды
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutDown 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 3000);
}

// Получить иконку для уведомления
function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Получить цвет для уведомления
function getNotificationColor(type) {
    const colors = {
        'success': 'rgba(0, 255, 136, 0.2)',
        'error': 'rgba(255, 68, 68, 0.2)',
        'warning': 'rgba(255, 170, 0, 0.2)',
        'info': 'rgba(0, 136, 255, 0.2)'
    };
    return colors[type] || 'rgba(0, 136, 255, 0.2)';
}

// Функция для быстрого перехода к таблице (можно вызвать из консоли)
function goToTable() {
    window.location.href = 'table.html';
}

// Функция для копирования данных в буфер обмена
function copyBudgetData() {
    const data = {
        total: '750 000 ₽',
        items: [
            { category: 'Агентство "Вектор"', amount: '250 000 ₽', percent: '33.3%' },
            { category: 'Performance Marketing', amount: '150 000 ₽', percent: '20%' },
            { category: 'Производство Креативов', amount: '150 000 ₽', percent: '20%' },
            { category: 'Trust & PR', amount: '100 000 ₽', percent: '13.3%' },
            { category: 'Optimization & Analytics', amount: '50 000 ₽', percent: '6.7%' },
            { category: 'Резервный Фонд', amount: '50 000 ₽', percent: '6.7%' }
        ]
    };
    
    const text = `Бюджет проекта "УмныйГород"\nОбщий бюджет: ${data.total}\n\n${data.items.map(item => `${item.category}: ${item.amount} (${item.percent})`).join('\n')}`;
    
    navigator.clipboard.writeText(text)
        .then(() => showNotification('Данные бюджета скопированы в буфер обмена', 'success'))
        .catch(() => showNotification('Не удалось скопировать данные', 'error'));
}

// Добавляем горячие клавиши для удобства
document.addEventListener('keydown', function(e) {
    // Ctrl + T для перехода к таблице
    if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        window.location.href = 'table.html';
    }
    
    // Ctrl + C для копирования данных
    if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        copyBudgetData();
    }
    
    // F1 для помощи
    if (e.key === 'F1') {
        e.preventDefault();
        alert('Горячие клавиши:\nCtrl+T - Перейти к таблице\nCtrl+C - Копировать данные бюджета\nF1 - Помощь');
    }
});
