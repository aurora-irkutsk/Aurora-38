// =============================================================================
// ИНИЦИАЛИЗАЦИЯ ПОСЛЕ ЗАГРУЗКИ DOM
// =============================================================================

document.addEventListener('DOMContentLoaded', function () {
  initGallery();
  initBurgerMenu();
  initCallModal();
  initPhoneValidation();
  initFormProtection();
  initCopyAddress();
  initSuccessModal();
});

// =============================================================================
// ГАЛЕРЕЯ (LIGHTBOX)
// =============================================================================

function initGallery() {
  // Отключаем галерею на мобильных устройствах
  if (window.innerWidth < 768) return;

  const imageModal = document.getElementById('imageModal');
  if (!imageModal) return;

  const modalImg = document.getElementById('modalImage');
  const closeBtn = imageModal.querySelector('.modal__close');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const counter = document.getElementById('imageCounter');
  const images = document.querySelectorAll('.portfolio__item img');

  if (images.length === 0) return;

  let currentIndex = 0;

  // Открытие модального окна при клике на изображение
  images.forEach((img, index) => {
    img.addEventListener('click', () => {
      currentIndex = index;
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      
      // Обработка ошибок загрузки изображения
      modalImg.onerror = () => {
        console.error('Ошибка загрузки изображения:', img.src);
        modalImg.alt = 'Изображение недоступно';
        // Можно добавить placeholder или сообщение пользователю
      };
      
      // Открытие модального окна после загрузки
      modalImg.onload = () => {
        imageModal.style.display = 'block';
        updateCounter();
        document.body.style.overflow = 'hidden';
      };
      
      // Если изображение уже загружено (из кеша)
      if (modalImg.complete) {
        imageModal.style.display = 'block';
        updateCounter();
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Обновление счётчика изображений
  function updateCounter() {
    if (counter) {
      counter.textContent = `${currentIndex + 1} / ${images.length}`;
    }
  }

  // Закрытие модального окна
  const closeModal = () => {
    imageModal.style.display = 'none';
    document.body.style.overflow = '';
  };

  // Обработчики событий
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal) closeModal();
  });

  // Функция для безопасной загрузки изображения
  const loadImage = (index) => {
    modalImg.src = images[index].src;
    modalImg.alt = images[index].alt;
    
    modalImg.onerror = () => {
      console.error('Ошибка загрузки изображения:', images[index].src);
      modalImg.alt = 'Изображение недоступно';
    };
    
    updateCounter();
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
      loadImage(currentIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
      loadImage(currentIndex);
    });
  }

  // Управление с клавиатуры
  document.addEventListener('keydown', (e) => {
    if (imageModal.style.display !== 'block') return;
    if (e.key === 'ArrowLeft') prevBtn?.click();
    if (e.key === 'ArrowRight') nextBtn?.click();
    if (e.key === 'Escape') closeModal();
  });
}

// =============================================================================
// БУРГЕР-МЕНЮ
// =============================================================================

function initBurgerMenu() {
  const burger = document.querySelector('.burger');
  const mobileMenu = document.querySelector('.mobile-menu');

  // Если элементов нет — выходим
  if (!burger || !mobileMenu) return;

  // Переключение меню
  burger.addEventListener('click', () => {
    const isActive = burger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    burger.setAttribute('aria-expanded', isActive);
  });

  // Закрытие по клику на ссылку
  const menuLinks = mobileMenu.querySelectorAll('a');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  });

  // Закрытие по клику вне меню
  document.addEventListener('click', (e) => {
    if (
      !mobileMenu.contains(e.target) &&
      !burger.contains(e.target) &&
      mobileMenu.classList.contains('active')
    ) {
      burger.classList.remove('active');
      mobileMenu.classList.remove('active');
    }
  });
}

// =============================================================================
// ПОПАП "ВЫЗВАТЬ МАСТЕРА"
// =============================================================================

function initCallModal() {
  const callModal = document.getElementById('callModal');
  const openCallBtn = document.getElementById('openCallModal');
  const closeCallBtn = document.getElementById('closeCallModal');

  if (!callModal || !openCallBtn || !closeCallBtn) return;

  const openCallModal = () => {
    callModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  };

  const closeCallModal = () => {
    callModal.style.display = 'none';
    document.body.style.overflow = '';
  };

  openCallBtn.addEventListener('click', openCallModal);
  closeCallBtn.addEventListener('click', closeCallModal);

  // Закрытие по клику на оверлей
  window.addEventListener('click', (e) => {
    if (e.target === callModal) closeCallModal();
  });
}

// =============================================================================
// ВАЛИДАЦИЯ И ФОРМАТИРОВАНИЕ НОМЕРА ТЕЛЕФОНА (ДЛЯ ОБЕИХ ФОРМ)
// =============================================================================

function initPhoneValidation() {
  // Функция инициализации одной формы
  function setupForm(form) {
    if (!form) return;

    const nameInput = form.querySelector('input[name="name"]');
    const phoneInput = form.querySelector('input[name="phone"]');
    const submitButton = form.querySelector('.request__button') || form.querySelector('.modal__button');
    let phoneError = form.querySelector('#phoneError');

    // Создаём элемент ошибки, если его нет
    if (!phoneError) {
      phoneError = document.createElement('div');
      phoneError.id = 'phoneError';
      phoneError.style.color = 'whitesmoke';
      phoneError.style.fontWeight = '500';
      phoneError.style.fontSize = 'clamp(1rem, 2.2vw, 1.2rem)';
      phoneError.style.marginTop = '5px';
      phoneError.style.display = 'none';
      phoneError.innerHTML = 'Введите номер в формате: 8 902 560 52 25';

      // Вставляем после кнопки отправки
      const button = form.querySelector('button[type="submit"]');
      if (button) {
        button.parentNode.insertBefore(phoneError, button.nextSibling);
      }
    }

    // Запрет цифр в поле имени
    if (nameInput) {
      nameInput.addEventListener('input', () => {
        nameInput.value = nameInput.value.replace(/\d/g, '');
      });
    }

    // Форматирование телефона
    if (phoneInput) {
      let isDeleting = false;

      phoneInput.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' || e.key === 'Delete') {
          isDeleting = true;
        }
      });

      phoneInput.addEventListener('input', () => {
        let value = phoneInput.value;
        value = value.replace(/[^\d+\s]/g, ''); // Только цифры, + и пробелы
        value = value.replace(/\s+/g, ' ');     // Убираем лишние пробелы
        const digits = value.replace(/\D/g, ''); // Только цифры

        let formatted = '';
        if (digits.startsWith('7') && digits.length >= 1) {
          formatted = '+7';
          if (digits.length > 1) formatted += ' ' + digits.slice(1, 4);
          if (digits.length > 4) formatted += ' ' + digits.slice(4, 7);
          if (digits.length > 7) formatted += ' ' + digits.slice(7, 9);
          if (digits.length > 9) formatted += ' ' + digits.slice(9, 11);
        } else if (digits.startsWith('8') && digits.length >= 1) {
          formatted = '8';
          if (digits.length > 1) formatted += ' ' + digits.slice(1, 4);
          if (digits.length > 4) formatted += ' ' + digits.slice(4, 7);
          if (digits.length > 7) formatted += ' ' + digits.slice(7, 9);
          if (digits.length > 9) formatted += ' ' + digits.slice(9, 11);
        } else if (digits.length > 0) {
          formatted = digits;
          if (digits.length > 3) formatted = digits.slice(0, 3) + ' ' + digits.slice(3, 6);
          if (digits.length > 6) formatted = digits.slice(0, 3) + ' ' + digits.slice(3, 6) + ' ' + digits.slice(6, 8);
          if (digits.length > 8) formatted = digits.slice(0, 3) + ' ' + digits.slice(3, 6) + ' ' + digits.slice(6, 8) + ' ' + digits.slice(8, 10);
        }

        // Сохраняем позицию курсора
        const start = phoneInput.selectionStart;
        const end = phoneInput.selectionEnd;
        phoneInput.value = formatted;
        if (!isDeleting) {
          phoneInput.setSelectionRange(formatted.length, formatted.length);
        }
        isDeleting = false;
      });
    }

    // Валидация при отправке формы
    form.addEventListener('submit', (e) => {
      let isValid = true;
      if (phoneInput) {
        const value = phoneInput.value.trim();
        const digits = value.replace(/\D/g, '');
        const has11Digits = digits.length === 11;
        const startsWithPlus7 = value.startsWith('+7');
        const startsWith8 = value.startsWith('8');

        if (!has11Digits || !(startsWithPlus7 || startsWith8)) {
          isValid = false;
          phoneError.style.display = 'block';
        } else {
          phoneError.style.display = 'none';
        }
      }

      if (!isValid) {
        e.preventDefault();
        if (submitButton) submitButton.disabled = true;
      } else {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }

  // Инициализируем обе формы
  const requestForm = document.getElementById('requestForm');
  const callForm = document.getElementById('callForm');

  setupForm(requestForm);
  setupForm(callForm);
}

// =============================================================================
// ЗАЩИТА ОТ ПОВТОРНЫХ ОТПРАВОК ФОРМЫ
// =============================================================================

function initFormProtection() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(function(form) {
    form.addEventListener('submit', function() {
      const submitButton = form.querySelector('button[type="submit"]');
      if (!submitButton) return;
      
      const originalText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = 'Отправка...';
      
      // Разблокировать через 5 секунд на случай ошибки
      setTimeout(function() {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }, 5000);
    });
  });
}

// =============================================================================
// КОПИРОВАНИЕ АДРЕСА
// =============================================================================

function initCopyAddress() {
  const copyBtn = document.getElementById('copyAddressBtn');
  const notification = document.getElementById('copyNotification');
  
  if (!copyBtn || !notification) return;
  
  copyBtn.addEventListener('click', function() {
    const address = copyBtn.getAttribute('data-address');
    
    // Попытка копирования через Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(address)
        .then(function() {
          showNotification();
        })
        .catch(function(err) {
          console.error('Ошибка копирования через Clipboard API:', err);
          fallbackCopy(address);
        });
    } else {
      // Fallback для старых браузеров
      fallbackCopy(address);
    }
  });
  
  // Показать уведомление о копировании
  function showNotification() {
    notification.classList.add('show');
    
    // Автоматически скрыть через 2.5 секунды
    setTimeout(function() {
      notification.classList.remove('show');
    }, 2500);
  }
  
  // Fallback метод копирования для старых браузеров
  function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    textArea.style.left = '-9999px';
    textArea.setAttribute('readonly', '');
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        showNotification();
      } else {
        console.error('Ошибка копирования через execCommand');
      }
    } catch (err) {
      console.error('Ошибка при копировании:', err);
    }
    
    document.body.removeChild(textArea);
  }
}

// =============================================================================
// МОДАЛЬНОЕ ОКНО УСПЕШНОЙ ОТПРАВКИ ФОРМЫ
// =============================================================================

function initSuccessModal() {
  const successModal = document.getElementById('successModal');
  const closeSuccessModal = document.getElementById('closeSuccessModal');
  const successModalBtn = document.getElementById('successModalBtn');
  const forms = document.querySelectorAll('form');

  if (!successModal) return;

  // Функция открытия модального окна
  const openSuccessModal = () => {
    successModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  };

  // Функция закрытия модального окна
  const closeModal = () => {
    successModal.style.display = 'none';
    document.body.style.overflow = '';
    // Перенаправляем на главную страницу
    window.location.href = window.location.pathname;
  };

  // Обработчики закрытия
  if (closeSuccessModal) {
    closeSuccessModal.addEventListener('click', closeModal);
  }

  if (successModalBtn) {
    successModalBtn.addEventListener('click', closeModal);
  }

  // Закрытие по клику на оверлей
  successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
      closeModal();
    }
  });

  // Закрытие по Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && successModal.style.display === 'block') {
      closeModal();
    }
  });

  // Обработка отправки всех форм
  forms.forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const action = form.getAttribute('action');

      try {
        const response = await fetch(action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          // Успешная отправка - показываем модальное окно
          form.reset();
          
          // Закрываем модальное окно вызова мастера, если оно открыто
          const callModal = document.getElementById('callModal');
          if (callModal && callModal.style.display === 'block') {
            callModal.style.display = 'none';
          }

          // Показываем модальное окно успеха
          openSuccessModal();
        } else {
          // Ошибка отправки
          alert('Произошла ошибка при отправке формы. Попробуйте позже или позвоните нам напрямую.');
        }
      } catch (error) {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при отправке формы. Попробуйте позже или позвоните нам напрямую.');
      }
    });
  });
}