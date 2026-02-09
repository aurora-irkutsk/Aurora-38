// =============================================================================
// MAGNETIC BUTTONS - Магнитные кнопки
// =============================================================================
// 
// ЧТО ДЕЛАЕТ:
// Кнопки "притягиваются" к курсору мыши при наведении - создается эффект
// магнита. Кнопка плавно следует за движением курсора в небольшом радиусе,
// а при уходе мыши возвращается на место с эффектом "пружины".
//
// ГДЕ РАБОТАЕТ:
// - Только на ДЕСКТОПАХ (ширина экрана > 768px)
// - Автоматически отключается на мобильных и планшетах
//
// КАКИЕ КНОПКИ:
// - Кнопка "Вызвать мастера" в header
// - Кнопка "Рассчитать по фото" в Hero секции
// - Кнопка "Отправить" в форме заявки
// - Кнопка "Отправить" в модальном окне
//
// ПРОИЗВОДИТЕЛЬНОСТЬ:
// - Очень низкая нагрузка на CPU
// - Использует CSS transforms (GPU-ускорение)
// - Плавная анимация 60 FPS
//
// =============================================================================

class MagneticButtons {
    constructor() {
        // Проверяем, что это десктоп
        this.isMobile = window.innerWidth <= 768;
        
        if (this.isMobile) {
            console.log('⚠️ Magnetic Buttons отключены (мобильное устройство)');
            return;
        }

        // Селекторы кнопок для магнитного эффекта
        this.buttonSelectors = [
            '.hero__button',          // Кнопка "Рассчитать по фото"
            '.header__button',        // Кнопка "Вызвать мастера" в header
            '#openCallModal',         // ID кнопки вызова мастера
            '.request__button',       // Кнопка "Отправить" в форме
            '.modal__button',         // Кнопка "Отправить" в модальном окне
            '#copyAddressBtn'         // Кнопка "Копировать адрес" на карте
        ];

        // Параметры магнитного эффекта
        this.magneticStrength = 0.15;  // Сила притяжения (0.1 - слабо, 0.5 - сильно) - УМЕНЬШЕНО для "лени"
        this.returnSpeed = 0.6;        // Скорость возврата (0.3 - медленно, 0.8 - быстро)

        this.init();
    }

    init() {
        // Находим все кнопки
        const buttons = document.querySelectorAll(this.buttonSelectors.join(', '));
        
        if (buttons.length === 0) {
            console.warn('⚠️ Magnetic Buttons: кнопки не найдены');
            return;
        }

        buttons.forEach(button => {
            this.applyMagneticEffect(button);
        });

        console.log(`✅ Magnetic Buttons активированы для ${buttons.length} кнопок`);
    }

    applyMagneticEffect(button) {
        // Обработчик входа мыши - добавляем легкую плавность для "лени"
        button.addEventListener('mouseenter', () => {
            button.style.transition = 'transform 0.15s ease-out'; // Небольшая задержка для плавности
        });

        // Обработчик движения мыши
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            
            // Центр кнопки
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Позиция курсора относительно центра
            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;
            
            // Применяем магнитное смещение
            const moveX = deltaX * this.magneticStrength;
            const moveY = deltaY * this.magneticStrength;
            
            // CSS transform БЕЗ transition для мгновенного отклика
            button.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });

        // Обработчик ухода мыши - возврат на место
        button.addEventListener('mouseleave', () => {
            // Включаем transition только для возврата
            button.style.transition = `transform ${this.returnSpeed}s cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
            button.style.transform = 'translate(0, 0)';
        });

        // Обработчик клика - небольшое сжатие
        button.addEventListener('mousedown', () => {
            button.style.transition = 'transform 0.1s ease';
            button.style.transform = 'scale(0.95)';
        });

        button.addEventListener('mouseup', () => {
            button.style.transition = 'transform 0.2s ease';
            button.style.transform = 'scale(1)';
        });
    }
}

// =============================================================================
// ИНИЦИАЛИЗАЦИЯ
// =============================================================================

// Запускаем после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Инициализация Magnetic Buttons...');
    
    // Создаем экземпляр класса
    const magneticButtons = new MagneticButtons();
    
    console.log('✨ Magnetic Buttons готовы к работе!');
});

// =============================================================================
// ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ
// =============================================================================
/*

📋 ИНСТРУКЦИЯ ПО НАСТРОЙКЕ:

1. Изменить силу магнита:
   this.magneticStrength = 0.5;  // 0.1 (слабо) до 0.8 (сильно)

2. Изменить скорость возврата:
   this.returnSpeed = 0.8;  // 0.3 (медленно) до 1.0 (быстро)

3. Добавить новые кнопки:
   Добавьте селектор в массив this.buttonSelectors

4. Отключить для конкретной кнопки:
   Удалите селектор из массива this.buttonSelectors

─────────────────────────────────────────────────────────

🎯 КАК РАБОТАЕТ:

1. При наведении мыши на кнопку
   → Кнопка смещается в сторону курсора

2. При движении мыши над кнопкой
   → Кнопка плавно следует за курсором

3. При уходе мыши
   → Кнопка возвращается на место с эффектом пружины

4. При клике
   → Кнопка немного сжимается (визуальный feedback)

─────────────────────────────────────────────────────────

⚙️ ТЕХНИЧЕСКИЕ ДЕТАЛИ:

• Библиотеки: Нет (чистый JavaScript)
• Размер: ~4 KB
• Нагрузка: Очень низкая
• FPS: 60 (плавная анимация)
• GPU: Да (CSS transforms)
• Мобильные: Автоматически отключается

─────────────────────────────────────────────────────────

✅ СОВМЕСТИМОСТЬ:

✓ Chrome, Firefox, Safari, Edge (все современные браузеры)
✓ Десктопы (Windows, macOS, Linux)
✗ Мобильные устройства (автоотключение)
✗ Старые браузеры (IE11 и ниже)

*/
