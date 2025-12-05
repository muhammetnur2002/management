/ Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Установка дат
    setDates();
    
    // Инициализация управления таблицей
    initTableControls();
    
    // Инициализация кнопок действий
    initActionButtons();
    
    // Инициализация модального окна
    initModal();
    
    // Инициализация экспорта
    initExport();
    
    // Обновление времени в реальном времени
    startTimeUpdates();
    
    // Инициализация сортировки
    initSorting();
    
    // Инициализация фильтрации
    initFiltering();
    
    // Инициализация поиска
    initSearch();
});

// Установка текущих дат
function setDates() {
    const now = new Date();
    const dateString = now.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    const timeString = now.toLocaleTimeString('ru-RU', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    // Установка даты в шапке
    const currentDateElement = document.getElementById('current-date');
    if (currentDateElement) {
        currentDateElement.textContent = dateString;
    }
    
    // Установка даты обновления
    const updateDateElement = document.getElementById('update-date');
    if (updateDateElement) {
        updateDateElement.textContent = dateString;
    }
    
    // Установка времени в футере
    const footerTimeElement = document.getElementById('footer-time');
    if (footerTimeElement) {
        footerTimeElement.textContent = timeString;
    }
}

// Обновление времени в реальном времени
function startTimeUpdates() {
    setInterval(() => {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ru-RU', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const footerTimeElement = document.getElementById('footer-time');
        if (footerTimeElement) {
            footerTimeElement.textContent = timeString;
        }
    }, 1000);
}

// Инициализация управления таблицей
function initTableControls() {
    // Кнопка печати
    const printButton = document.getElementById('printTable');
    if (printButton) {
        printButton.addEventListener('click', printTable);
    }
    
    // Кнопка возврата
    const backButtons = document.querySelectorAll('a[href="index.html"]');
    backButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!confirm('Вы уверены, что хотите вернуться к плану? Все несохранённые изменения будут потеряны.')) {
                e.preventDefault();
            }
        });
    });
}

// Печать таблицы
function printTable() {
    // Сохраняем текущее состояние
    const originalStyles = document.querySelectorAll('style, link[rel="stylesheet"]');
    const printWindow = window.open('', '_blank');
    
    // Получаем HTML для печати
    const tableHTML = document.querySelector('.table-container').outerHTML;
    
    // Создаем минималистичный стиль для печати
    const printStyles = `
        <style>
            @media print {
                body {
                    font-family: Arial, sans-serif;
                    color: #000;
                    background: #fff;
                }
                .table-container {
                    border: 1px solid #000;
                    box-shadow: none;
                }
                .navigation-controls,
                .table-controls,
                .action-buttons,
                .modal-overlay,
                .analysis-section,
                .table-footer-info {
                    display: none !important;
                }
                .cyber-table {
                    border: 1px solid #000;
                }
                .cyber-table th {
                    background: #f0f0f0 !important;
                    color: #000 !important;
                    border-bottom: 2px solid #000 !important;
                }
                .cyber-table td {
                    border-bottom: 1px solid #ddd !important;
                }
                .status-badge {
                    border: 1px solid #000 !important;
                    background: #fff !important;
                    color: #000 !important;
                }
                .priority {
                    display: none;
                }
                @page {
                    margin: 2cm;
                }
            }
        </style>
    `;
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Бюджет проекта "УмныйГород"</title>
            ${printStyles}
        </head>
        <body>
            <h1>Бюджет проекта "УмныйГород"</h1>
            <p>Дата генерации: ${new Date().toLocaleDateString('ru-RU')}</p>
            ${tableHTML}
            <script>
                window.onload = function() {
                    window.print();
                    window.close();
                }
            </script>
        </body>
        </html>
    `);
    
    printWindow.document.close();
}

// Инициализация кнопок действий
function initActionButtons() {
    // Кнопки "Просмотреть"
    const viewButtons = document.querySelectorAll('.action-btn.view');
    viewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const row = this.closest('.table-row');
            showRowDetails(row);
        });
    });
    
    // Кнопки "Редактировать"
    const editButtons = document.querySelectorAll('.action-btn.edit');
    editButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const row = this.closest('.table-row');
            editRow(row);
        });
    });
    
    // Кнопки "Утвердить всё"
    const approveAllButton = document.querySelector('.footer-btn.approve-all');
    if (approveAllButton) {
        approveAllButton.addEventListener('click', approveAllItems);
    }
    
    // Клик по строке таблицы
    const tableRows = document.querySelectorAll('.table-row');
    tableRows.forEach(row => {
        row.addEventListener('click', function(e) {
            if (!e.target.closest('.action-btn')) {
                toggleRowSelection(this);
            }
        });
    });
}

// Показать детали строки
function showRowDetails(row) {
    const rowNumber = row.querySelector('.row-number').textContent;
    const category = row.querySelector('.category-info h3').textContent;
    const description = row.querySelector('.detail-main').textContent;
    const amount = row.querySelector('.amount-value').textContent;
    const percent = row.querySelector('.percent-value').textContent;
    const status = row.querySelector('.status-text').textContent;
    
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = `Детали: ${category}`;
    
    modalBody.innerHTML = `
        <div class="detail-grid">
            <div class="detail-item">
                <strong>Номер:</strong>
                <span>${rowNumber}</span>
            </div>
            <div class="detail-item">
                <strong>Категория:</strong>
                <span>${category}</span>
            </div>
            <div class="detail-item">
                <strong>Описание:</strong>
                <p>${description}</p>
            </div>
            <div class="detail-item">
                <strong>Сумма:</strong>
                <span class="detail-amount">${amount} ₽</span>
            </div>
            <div class="detail-item">
                <strong>Доля бюджета:</strong>
                <span class="detail-percent">${percent}</span>
            </div>
            <div class="detail-item">
                <strong>Статус:</strong>
                <span class="detail-status ${getStatusClass(status)}">${status}</span>
            </div>
            <div class="detail-item">
                <strong>Мета-данные:</strong>
                <div class="detail-meta">
                    ${getRowMetaData(row)}
                </div>
            </div>
        </div>
        <div class="detail-actions">
            <h4>Доступные действия:</h4>
            <div class="action-list">
                ${getAvailableActions(row)}
            </div>
        </div>
    `;
    
    showModal();
}

// Получить класс статуса
function getStatusClass(status) {
    const statusMap = {
        'УТВЕРЖДЕНО': 'approved',
        'В РАБОТЕ': 'pending',
        'ПРОИЗВОДСТВО': 'pending',
        'ПЛАНИРУЕТСЯ': 'planned',
        'В ОЧЕРЕДИ': 'planned',
        'КРИТИЧЕСКИЙ': 'critical'
    };
    return statusMap[status] || '';
}

// Получить мета-данные строки
function getRowMetaData(row) {
    const metaItems = row.querySelectorAll('.meta-item');
    let metaHTML = '';
    metaItems.forEach(item => {
        metaHTML += `<div class="meta-line">${item.innerHTML}</div>`;
    });
    return metaHTML;
}

// Получить доступные действия
function getAvailableActions(row) {
    const status = row.querySelector('.status-text').textContent;
    const actions = row.querySelectorAll('.action-btn');
    let actionsHTML = '';
    
    actions.forEach(btn => {
        const title = btn.getAttribute('title');
        const icon = btn.querySelector('i').className;
        actionsHTML += `
            <div class="action-item">
                <i class="${icon}"></i>
                <span>${title}</span>
            </div>
        `;
    });
    
    return actionsHTML;
}

// Редактировать строку
function editRow(row) {
    const rowNumber = row.querySelector('.row-number').textContent;
    const category = row.querySelector('.category-info h3').textContent;
    const currentAmount = row.querySelector('.amount-value').textContent;
    const currentPercent = row.querySelector('.percent-value').textContent;
    
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = `Редактирование: ${category}`;
    
    modalBody.innerHTML = `
        <form id="editForm" class="edit-form">
            <div class="form-group">
                <label for="editAmount">Сумма (₽)</label>
                <input type="number" id="editAmount" value="${currentAmount.replace(/\s/g, '')}" step="1000" min="0">
            </div>
            <div class="form-group">
                <label for="editPercent">Доля бюджета (%)</label>
                <input type="number" id="editPercent" value="${currentPercent.replace('%', '')}" step="0.1" min="0" max="100">
            </div>
            <div class="form-group">
                <label for="editStatus">Статус</label>
                <select id="editStatus">
                    <option value="approved">УТВЕРЖДЕНО</option>
                    <option value="pending">В РАБОТЕ</option>
                    <option value="planned">ПЛАНИРУЕТСЯ</option>
                    <option value="critical">КРИТИЧЕСКИЙ</option>
                </select>
            </div>
            <div class="form-group">
                <label for="editNotes">Примечания</label>
                <textarea id="editNotes" rows="3" placeholder="Введите примечания..."></textarea>
            </div>
            <div class="form-warning">
                <i class="fas fa-exclamation-triangle"></i>
                <span>Изменение бюджета может повлиять на другие статьи расходов!</span>
            </div>
        </form>
    `;
    
    // Установить текущий статус
    const currentStatus = row.querySelector('.status-text').textContent;
    const statusMap = {
        'УТВЕРЖДЕНО': 'approved',
        'В РАБОТЕ': 'pending',
        'ПРОИЗВОДСТВО': 'pending',
        'ПЛАНИРУЕТСЯ': 'planned',
        'В ОЧЕРЕДИ': 'planned',
        'КРИТИЧЕСКИЙ': 'critical'
    };
    document.getElementById('editStatus').value = statusMap[currentStatus] || 'pending';
    
    showModal();
    
    // Обработка сохранения формы
    const editForm = document.getElementById('editForm');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveRowChanges(row);
        });
    }
}

// Сохранить изменения строки
function saveRowChanges(row) {
    const newAmount = document.getElementById('editAmount').value;
    const newPercent = document.getElementById('editPercent').value;
    const newStatus = document.getElementById('editStatus').value;
    
    // Обновляем сумму
    const amountValue = row.querySelector('.amount-value');
    amountValue.textContent = parseInt(newAmount).toLocaleString('ru-RU');
    
    // Обновляем процент
    const percentValue = row.querySelector('.percent-value');
    const percentBar = row.querySelector('.percent-bar-fill');
    percentValue.textContent = `${newPercent}%`;
    percentBar.style.width = `${newPercent}%`;
    percentBar.setAttribute('data-percent', newPercent);
    
    // Обновляем статус
    updateRowStatus(row, newStatus);
    
    // Показываем уведомление
    showNotification('Изменения сохранены!', 'success');
    
    // Закрываем модальное окно
    closeModal();
    
    // Обновляем статистику
    updateStats();
}

// Обновить статус строки
function updateRowStatus(row, status) {
    const statusBadge = row.querySelector('.status-badge');
    const statusIcon = row.querySelector('.status-icon');
    const statusText = row.querySelector('.status-text');
    
    // Удаляем старые классы статуса
    statusBadge.classList.remove('approved', 'pending', 'planned', 'critical');
    statusIcon.className = 'status-icon';
    
    const statusConfig = {
        'approved': {
            class: 'approved',
            icon: 'fas fa-check-circle',
            text: 'УТВЕРЖДЕНО',
            date: 'Обновлено сегодня'
        },
        'pending': {
            class: 'pending',
            icon: 'fas fa-clock',
            text: 'В РАБОТЕ',
            date: 'Активно сейчас'
        },
        'planned': {
            class: 'planned',
            icon: 'fas fa-calendar',
            text: 'ПЛАНИРУЕТСЯ',
            date: 'Старт на 2-й неделе'
        },
        'critical': {
            class: 'critical',
            icon: 'fas fa-radiation',
            text: 'КРИТИЧЕСКИЙ',
            date: 'Требует внимания'
        }
    };
    
    const config = statusConfig[status];
    if (config) {
        statusBadge.classList.add(config.class);
        statusIcon.className = `status-icon ${config.icon}`;
        statusText.textContent = config.text;
        
        const statusDate = row.querySelector('.status-date');
        if (statusDate) {
            statusDate.textContent = config.date;
        }
        
        // Обновляем data-атрибут для фильтрации
        row.setAttribute('data-status', status);
    }
}

// Утвердить все элементы
function approveAllItems() {
    if (!confirm('Вы уверены, что хотите утвердить все статьи бюджета? Это действие нельзя отменить.')) {
        return;
    }
    
    const rows = document.querySelectorAll('.table-row');
    rows.forEach(row => {
        if (!row.classList.contains('critical')) {
            updateRowStatus(row, 'approved');
        }
    });
    
    showNotification('Все статьи бюджета утверждены!', 'success');
    updateStats();
}

// Выделение строки
function toggleRowSelection(row) {
    const isSelected = row.classList.contains('selected');
    
    // Снимаем выделение со всех строк
    document.querySelectorAll('.table-row.selected').forEach(r => {
        r.classList.remove('selected');
    });
    
    // Если строка не была выделена - выделяем её
    if (!isSelected) {
        row.classList.add('selected');
        row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Инициализация модального окна
function initModal() {
    const modal = document.getElementById('detailModal');
    const closeButton = document.getElementById('closeModal');
    const cancelButton = document.getElementById('cancelModal');
    
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
    
    if (cancelButton) {
        cancelButton.addEventListener('click', closeModal);
    }
    
    // Закрытие по клику вне окна
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Показать модальное окно
function showModal() {
    const modal = document.getElementById('detailModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Закрыть модальное окно
function closeModal() {
    const modal = document.getElementById('detailModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Инициализация экспорта
function initExport() {
    // Экспорт в CSV
    const exportCSVButton = document.getElementById('exportCSV');
    if (exportCSVButton) {
        exportCSVButton.addEventListener('click', exportToCSV);
    }
    
    // Кнопки экспорта в футере
    const exportButtons = document.querySelectorAll('.export-btn');
    exportButtons.forEach(button => {
        button.addEventListener('click', function() {
            const type = this.classList[1]; // pdf, excel, csv
            exportData(type);
        });
    });
}

// Экспорт в CSV
function exportToCSV() {
    const rows = document.querySelectorAll('.table-row');
    let csvContent = "Номер;Категория;Описание;Сумма (₽);Доля (%);Статус\n";
    
    rows.forEach(row => {
        const cells = [
            row.querySelector('.row-number').textContent,
            row.querySelector('.category-info h3').textContent,
            row.querySelector('.detail-main').textContent.replace(/;/g, ','),
            row.querySelector('.amount-value').textContent.replace(/\s/g, ''),
            row.querySelector('.percent-value').textContent.replace('%', ''),
            row.querySelector('.status-text').textContent
        ];
        
        csvContent += cells.join(';') + '\n';
    });
    
    // Добавляем итоги
    csvContent += `\nИТОГО;;;${document.querySelector('.total-value').textContent.replace(/\s/g, '')};100;БЮДЖЕТ СОГЛАСОВАН`;
    
    // Создаем и скачиваем файл
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `бюджет_умныйгород_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Файл CSV успешно экспортирован!', 'success');
}

// Экспорт данных
function exportData(type) {
    switch(type) {
        case 'csv':
            exportToCSV();
            break;
        case 'excel':
            showNotification('Экспорт в Excel пока не реализован', 'warning');
            break;
        case 'pdf':
            showNotification('Экспорт в PDF пока не реализован', 'warning');
            break;
    }
}

// Инициализация сортировки
function initSorting() {
    const sortColumnSelect = document.getElementById('sortColumn');
    const sortOrderSelect = document.getElementById('sortOrder');
    const tableHeaders = document.querySelectorAll('.cyber-table th[data-sort]');
    
    // Сортировка при изменении select
    if (sortColumnSelect && sortOrderSelect) {
        const sortHandler = () => {
            const column = sortColumnSelect.value;
            const order = sortOrderSelect.value;
            sortTable(column, order);
        };
        
        sortColumnSelect.addEventListener('change', sortHandler);
        sortOrderSelect.addEventListener('change', sortHandler);
    }
    
    // Сортировка по клику на заголовок
    tableHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const column = this.getAttribute('data-sort');
            const currentOrder = this.classList.contains('sort-asc') ? 'desc' : 'asc';
            sortTable(column, currentOrder);
            
            // Обновляем визуальные индикаторы
            tableHeaders.forEach(h => {
                h.classList.remove('sort-asc', 'sort-desc');
            });
            this.classList.add(`sort-${currentOrder}`);
        });
    });
}

// Сортировка таблицы
function sortTable(column, order) {
    const table = document.getElementById('budgetTable');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('.table-row'));
    
    rows.sort((a, b) => {
        let aValue, bValue;
        
        switch(column) {
            case 'id':
                aValue = parseInt(a.querySelector('.row-number').textContent);
                bValue = parseInt(b.querySelector('.row-number').textContent);
                break;
            case 'category':
                aValue = a.querySelector('.category-info h3').textContent.toLowerCase();
                bValue = b.querySelector('.category-info h3').textContent.toLowerCase();
                break;
            case 'amount':
                aValue = parseInt(a.querySelector('.amount-value').textContent.replace(/\s/g, ''));
                bValue = parseInt(b.querySelector('.amount-value').textContent.replace(/\s/g, ''));
                break;
            case 'percent':
                aValue = parseFloat(a.querySelector('.percent-value').textContent.replace('%', ''));
                bValue = parseFloat(b.querySelector('.percent-value').textContent.replace('%', ''));
                break;
            case 'status':
                aValue = a.querySelector('.status-text').textContent;
                bValue = b.querySelector('.status-text').textContent;
                break;
            default:
                aValue = a.querySelector('.detail-main').textContent.toLowerCase();
                bValue = b.querySelector('.detail-main').textContent.toLowerCase();
        }
        
        if (order === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });
    
    // Переставляем строки
    rows.forEach(row => tbody.appendChild(row));
    
    // Обновляем номера строк
    updateRowNumbers();
    
    showNotification(`Таблица отсортирована по ${getColumnName(column)} (${order === 'asc' ? 'возрастанию' : 'убыванию'})`, 'info');
}

// Получить название колонки
function getColumnName(key) {
    const names = {
        'id': 'номеру',
        'category': 'категории',
        'amount': 'сумме',
        'percent': 'проценту',
        'status': 'статусу',
        'details': 'описанию'
    };
    return names[key] || key;
}

// Обновить номера строк
function updateRowNumbers() {
    const rows = document.querySelectorAll('.table-row');
    rows.forEach((row, index) => {
        const numberCell = row.querySelector('.row-number');
        if (numberCell) {
            numberCell.textContent = (index + 1).toString().padStart(2, '0');
        }
    });
}

// Инициализация фильтрации
function initFiltering() {
    const filterTabs = document.querySelectorAll('.nav-tab[data-filter]');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Обновляем активную вкладку
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Применяем фильтр
            applyFilter(filter);
        });
    });
}

// Применить фильтр
function applyFilter(filter) {
    const rows = document.querySelectorAll('.table-row');
    
    rows.forEach(row => {
        const status = row.getAttribute('data-status');
        const isCritical = row.classList.contains('critical');
        
        let showRow = true;
        
        switch(filter) {
            case 'all':
                showRow = true;
                break;
            case 'active':
                showRow = status === 'approved' || status === 'pending';
                break;
            case 'pending':
                showRow = status === 'pending';
                break;
            case 'critical':
                showRow = isCritical || status === 'critical';
                break;
            case 'planned':
                showRow = status === 'planned';
                break;
        }
        
        if (showRow) {
            row.classList.remove('filtered-out');
        } else {
            row.classList.add('filtered-out');
        }
    });
    
    const filterNames = {
        'all': 'все категории',
        'active': 'активные',
        'pending': 'в работе',
        'critical': 'критические',
        'planned': 'планируемые'
    };
    
    showNotification(`Показаны ${filterNames[filter]} статьи бюджета`, 'info');
}

// Инициализация поиска
function initSearch() {
    const searchInput = document.getElementById('tableSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            if (searchTerm.length === 0) {
                clearSearch();
                return;
            }
            
            performSearch(searchTerm);
        });
        
        // Очистка поиска при нажатии Escape
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.value = '';
                clearSearch();
            }
        });
    }
}

// Выполнить поиск
function performSearch(term) {
    const rows = document.querySelectorAll('.table-row');
    let foundCount = 0;
    
    rows.forEach(row => {
        const category = row.querySelector('.category-info h3').textContent.toLowerCase();
        const description = row.querySelector('.detail-main').textContent.toLowerCase();
        const tags = Array.from(row.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
        const details = row.querySelector('.detail-meta')?.textContent.toLowerCase() || '';
        
        const searchableText = category + ' ' + description + ' ' + tags.join(' ') + ' ' + details;
        
        if (searchableText.includes(term)) {
            row.classList.remove('filtered-out');
            highlightText(row, term);
            foundCount++;
        } else {
            row.classList.add('filtered-out');
        }
    });
    
    showNotification(`Найдено ${foundCount} результатов по запросу "${term}"`, foundCount > 0 ? 'success' : 'warning');
}

// Подсветка текста
function highlightText(element, term) {
    // Снимаем предыдущую подсветку
    element.querySelectorAll('.highlight').forEach(el => {
        const parent = el.parentNode;
        parent.replaceChild(document.createTextNode(el.textContent), el);
        parent.normalize();
    });
    
    // Подсвечиваем в заголовке категории
    const category = element.querySelector('.category-info h3');
    highlightInElement(category, term);
    
    // Подсвечиваем в описании
    const description = element.querySelector('.detail-main');
    highlightInElement(description, term);
    
    // Подсвечиваем в мета-данных
    const metaItems = element.querySelectorAll('.meta-item');
    metaItems.forEach(item => highlightInElement(item, term));
}

// Подсветка в элементе
function highlightInElement(element, term) {
    const text = element.textContent;
    const regex = new RegExp(`(${term})`, 'gi');
    const highlighted = text.replace(regex, '<span class="highlight">$1</span>');
    
    if (highlighted !== text) {
        element.innerHTML = highlighted;
    }
}

// Очистить поиск
function clearSearch() {
    const rows = document.querySelectorAll('.table-row');
    rows.forEach(row => {
        row.classList.remove('filtered-out');
        
        // Убираем подсветку
        row.querySelectorAll('.highlight').forEach(el => {
            const parent = el.parentNode;
            parent.replaceChild(document.createTextNode(el.textContent), el);
            parent.normalize();
        });
    });
    
    showNotification('Поиск очищен', 'info');
}

// Обновить статистику
function updateStats() {
    // Здесь можно обновить статистику на панели
    // Например, пересчитать проценты и суммы
    console.log('Статистика обновлена');
}

// Показать уведомление
function showNotification(message, type) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        border: 1px solid var(--border-glow);
        border-radius: 5px;
        padding: 15px 20px;
        color: var(--text-primary);
        font-family: 'Rajdhani', sans-serif;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        z-index: 10001;
        backdrop-filter: blur(10px);
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    
    // Анимация появления
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Кнопка закрытия
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
    
    // Автоматическое закрытие через 5 секунд
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
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

// Дополнительные функции для таблицы

// Экспорт в JSON
function exportToJSON() {
    const rows = document.querySelectorAll('.table-row');
    const data = [];
    
    rows.forEach(row => {
        const item = {
            id: row.querySelector('.row-number').textContent,
            category: row.querySelector('.category-info h3').textContent,
            description: row.querySelector('.detail-main').textContent,
            amount: parseInt(row.querySelector('.amount-value').textContent.replace(/\s/g, '')),
            percent: parseFloat(row.querySelector('.percent-value').textContent.replace('%', '')),
            status: row.querySelector('.status-text').textContent,
            tags: Array.from(row.querySelectorAll('.tag')).map(tag => tag.textContent)
        };
        data.push(item);
    });
    
    const jsonData = {
        project: "УмныйГород",
        total: parseInt(document.querySelector('.total-value').textContent.replace(/\s/g, '')),
        currency: "RUB",
        date: new Date().toISOString(),
        items: data
    };
    
    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    
    link.href = URL.createObjectURL(blob);
    link.download = `бюджет_умныйгород_${new Date().toISOString().slice(0,10)}.json`;
    link.click();
    
    showNotification('Файл JSON успешно экспортирован!', 'success');
}

// Анализ распределения бюджета
function analyzeBudget() {
    const rows = document.querySelectorAll('.table-row');
    let total = 0;
    let approved = 0;
    let pending = 0;
    let planned = 0;
    let critical = 0;
    
    rows.forEach(row => {
        const amount = parseInt(row.querySelector('.amount-value').textContent.replace(/\s/g, ''));
        const status = row.querySelector('.status-text').textContent;
        
        total += amount;
        
        switch(status) {
            case 'УТВЕРЖДЕНО':
                approved += amount;
                break;
            case 'В РАБОТЕ':
            case 'ПРОИЗВОДСТВО':
                pending += amount;
                break;
            case 'ПЛАНИРУЕТСЯ':
            case 'В ОЧЕРЕДИ':
                planned += amount;
                break;
            case 'КРИТИЧЕСКИЙ':
                critical += amount;
                break;
        }
    });
    
    return {
        total,
        approved: (approved / total * 100).toFixed(1),
        pending: (pending / total * 100).toFixed(1),
        planned: (planned / total * 100).toFixed(1),
        critical: (critical / total * 100).toFixed(1)
    };
}

// Показать анализ бюджета
function showBudgetAnalysis() {
    const analysis = analyzeBudget();
    
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = 'АНАЛИЗ РАСПРЕДЕЛЕНИЯ БЮДЖЕТА';
    
    modalBody.innerHTML = `
        <div class="analysis-modal">
            <div class="analysis-summary">
                <h4>Сводка по статусам:</h4>
                <div class="summary-grid">
                    <div class="summary-item approved">
                        <div class="summary-label">УТВЕРЖДЕНО</div>
                        <div class="summary-value">${analysis.approved}%</div>
                    </div>
                    <div class="summary-item pending">
                        <div class="summary-label">В РАБОТЕ</div>
                        <div class="summary-value">${analysis.pending}%</div>
                    </div>
                    <div class="summary-item planned">
                        <div class="summary-label">ПЛАНИРУЕТСЯ</div>
                        <div class="summary-value">${analysis.planned}%</div>
                    </div>
                    <div class="summary-item critical">
                        <div class="summary-label">КРИТИЧЕСКИЕ</div>
                        <div class="summary-value">${analysis.critical}%</div>
                    </div>
                </div>
            </div>
            <div class="analysis-recommendations">
                <h4>Рекомендации:</h4>
                <ul>
                    <li>Увеличить долю утверждённого бюджета для снижения рисков</li>
                    <li>Перевести критические статьи в работу или утвердить</li>
                    <li>Уточнить сроки для планируемых статей</li>
                    <li>Еженедельный мониторинг статусов</li>
                </ul>
            </div>
        </div>
    `;
    
    showModal();
}

// Добавляем кнопку анализа в навигацию
function addAnalysisButton() {
    const navControls = document.querySelector('.navigation-controls');
    if (navControls) {
        const analysisBtn = document.createElement('button');
        analysisBtn.className = 'nav-btn';
        analysisBtn.innerHTML = '<i class="fas fa-chart-pie"></i><span>АНАЛИЗ</span>';
        analysisBtn.addEventListener('click', showBudgetAnalysis);
        navControls.appendChild(analysisBtn);
    }
}

// Вызываем добавление кнопки анализа
setTimeout(addAnalysisButton, 1000);
