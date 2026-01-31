// Отслеживание кликов по телефону
document.addEventListener('DOMContentLoaded', function() {
    
    // Клики по телефону
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click_phone', {
                    'event_category': 'Contact',
                    'event_label': 'Phone Click',
                    'value': 1
                });
            }
        });
    });
    
    // Клики по WhatsApp
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    whatsappLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click_whatsapp', {
                    'event_category': 'Contact',
                    'event_label': 'WhatsApp Click',
                    'value': 1
                });
            }
        });
    });
    
    // Клики по Telegram
    const telegramLinks = document.querySelectorAll('a[href*="t.me"]');
    telegramLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click_telegram', {
                    'event_category': 'Contact',
                    'event_label': 'Telegram Click',
                    'value': 1
                });
            }
        });
    });
    
    // Отправка формы "Вызвать мастера"
    const callForm = document.getElementById('callForm');
    if (callForm) {
        callForm.addEventListener('submit', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit_call_master', {
                    'event_category': 'Lead',
                    'event_label': 'Form: Call Master',
                    'value': 10
                });
            }
        });
    }
    
    // Отправка формы "Оставить заявку"
    const requestForm = document.getElementById('requestForm');
    if (requestForm) {
        requestForm.addEventListener('submit', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit_request', {
                    'event_category': 'Lead',
                    'event_label': 'Form: Request',
                    'value': 10
                });
            }
        });
    }
    
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