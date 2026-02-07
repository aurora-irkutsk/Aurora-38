// Отслеживание кликов по телефону
document.addEventListener('DOMContentLoaded', function() {
    
    // Универсальная функция для отслеживания кликов по ссылкам
    function trackLinkClick(selector, eventName, eventLabel, eventValue) {
        const links = document.querySelectorAll(selector);
        links.forEach(function(link) {
            link.addEventListener('click', function() {
                if (typeof gtag !== 'undefined') {
                    gtag('event', eventName, {
                        'event_category': 'Contact',
                        'event_label': eventLabel,
                        'value': eventValue || 1
                    });
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
                if (typeof gtag !== 'undefined') {
                    gtag('event', eventName, {
                        'event_category': 'Lead',
                        'event_label': eventLabel,
                        'value': eventValue || 10
                    });
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
    
    if (pageViews === 3 && typeof gtag !== 'undefined') {
        gtag('event', 'engaged_user', {
            'event_category': 'Engagement',
            'event_label': '3+ Pages Viewed',
            'value': 1
        });
    }
    
    // Клик по кнопке "Рассчитать по фото"
    const calculateButtons = document.querySelectorAll('.hero__button');
    calculateButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click_calculate', {
                    'event_category': 'Lead',
                    'event_label': 'Calculate by Photo',
                    'value': 5
                });
            }
        });
    });
    
    // Клик по услуге
    const serviceLinks = document.querySelectorAll('.service__link');
    serviceLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            const serviceName = this.closest('.service').querySelector('.service__title').textContent;
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click_service', {
                    'event_category': 'Navigation',
                    'event_label': serviceName,
                    'value': 1
                });
            }
        });
    });
});