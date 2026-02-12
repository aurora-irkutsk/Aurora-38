// Cookie Consent Banner
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, был ли уже дан ответ на cookies (работает для всего сайта)
    const cookieConsent = localStorage.getItem('cookieConsent');
    
    // Показываем баннер ТОЛЬКО если:
    // 1. Пользователь еще не принял и не отклонил cookies
    // 2. Это первое посещение сайта
    if (!cookieConsent) {
        // Показываем баннер только если ответа еще не было
        setTimeout(function() {
            const banner = document.getElementById('cookieConsentBanner');
            if (banner) {
                banner.classList.add('cookie-consent--visible');
            }
        }, 1000); // Показываем через 1 секунду после загрузки страницы
    }
    
    // Обработчик кнопки "Принять"
    const acceptBtn = document.getElementById('acceptCookies');
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'accepted');
            hideBanner();
            
            // Отправляем событие в Яндекс.Метрику
            if (typeof ym !== 'undefined') {
                ym(104935828, 'reachGoal', 'cookie_accepted');
            }
        });
    }
    
    // Обработчик кнопки "Отклонить"
    const declineBtn = document.getElementById('declineCookies');
    if (declineBtn) {
        declineBtn.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'declined');
            hideBanner();
            
            // Отправляем событие в Яндекс.Метрику
            if (typeof ym !== 'undefined') {
                ym(104935828, 'reachGoal', 'cookie_declined');
            }
        });
    }
    
    // Функция скрытия баннера с анимацией
    function hideBanner() {
        const banner = document.getElementById('cookieConsentBanner');
        if (banner) {
            banner.classList.remove('cookie-consent--visible');
            setTimeout(function() {
                banner.style.display = 'none';
            }, 400); // Ждем окончания анимации
        }
    }
});
