// Отслеживание кликов по телефону
document.addEventListener('DOMContentLoaded', function() {
    
    // Универсальная функция для отслеживания кликов по ссылкам
    function trackLinkClick(selector, eventName, eventLabel, eventValue) {
        const links = document.querySelectorAll(selector);
        links.forEach(function(link) {
            link.addEventListener('click', function() {
                // Отправка события в Яндекс.Метрику
                if (typeof ym !== 'undefined') {
                    ym(104935828, 'reachGoal', eventName);
                }
            });
        });
    }
    
    // Отслеживание контактных ссылок
    trackLinkClick('a[href^="tel:"]', 'click_phone', 'Phone Click', 1);
    trackLinkClick('a[href*="wa.me"]', 'click_whatsapp', 'WhatsApp Click', 1);
    trackLinkClick('a[href*="t.me"]', 'click_telegram', 'Telegram Click', 1);
    
    // Универсальная функция для отслеживания отправки форм
    function trackFormSubmit(formId, eventName, eventLabel, eventValue) {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', function() {
                // Отправка события в Яндекс.Метрику
                if (typeof ym !== 'undefined') {
                    ym(104935828, 'reachGoal', eventName);
                }
            });
        }
    }
    
    // Отслеживание отправки форм
    trackFormSubmit('callForm', 'form_submit_call_master', 'Form: Call Master', 10);
    trackFormSubmit('requestForm', 'form_submit_request', 'Form: Request', 10);
    
    // Просмотр 3+ страниц (engagement)
    let pageViews = parseInt(sessionStorage.getItem('pageViews') || '0');
    pageViews++;
    sessionStorage.setItem('pageViews', pageViews);
    
    if (pageViews === 3 && typeof ym !== 'undefined') {
        ym(104935828, 'reachGoal', 'engaged_user');
    }
    
    // Клик по кнопке "Рассчитать по фото"
    const calculateButtons = document.querySelectorAll('.hero__button');
    calculateButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            if (typeof ym !== 'undefined') {
                ym(104935828, 'reachGoal', 'click_calculate');
            }
        });
    });
    
    // Клик по услуге
    const serviceLinks = document.querySelectorAll('.service__link');
    serviceLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            if (typeof ym !== 'undefined') {
                ym(104935828, 'reachGoal', 'click_service');
            }
        });
    });
});