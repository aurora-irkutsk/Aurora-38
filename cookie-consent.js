// Cookie Consent Banner
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, был ли уже дан ответ на cookies (работает для всего сайта)
    const cookieConsent = localStorage.getItem('cookieConsent');
    const cookieConsentDate = localStorage.getItem('cookieConsentDate');
    
    // Проверяем срок действия согласия (30 дней)
    let shouldShowBanner = false;
    
    if (!cookieConsent) {
        // Если ответа нет - показываем
        shouldShowBanner = true;
    } else if (cookieConsentDate) {
        // Если есть ответ и дата - проверяем, прошло ли 30 дней
        const consentTimestamp = parseInt(cookieConsentDate);
        const currentTimestamp = new Date().getTime();
        const daysPassed = (currentTimestamp - consentTimestamp) / (1000 * 60 * 60 * 24);
        
        if (daysPassed > 30) {
            // Прошло больше 30 дней - показываем снова
            shouldShowBanner = true;
            // Очищаем старые данные
            localStorage.removeItem('cookieConsent');
            localStorage.removeItem('cookieConsentDate');
        }
    } else {
        // Есть согласие, но нет даты (старая версия) - обновляем
        shouldShowBanner = true;
        localStorage.removeItem('cookieConsent');
    }
    
    if (shouldShowBanner) {
        // Показываем баннер
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
            localStorage.setItem('cookieConsentDate', new Date().getTime().toString());
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
            localStorage.setItem('cookieConsentDate', new Date().getTime().toString());
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
