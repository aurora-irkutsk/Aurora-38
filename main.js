// =============================================================================
// ИНИЦИАЛИЗАЦИЯ ПОСЛЕ ЗАГРУЗКИ DOM
// =============================================================================

document.addEventListener('DOMContentLoaded', function () {
  initGallery();
  initBurgerMenu();
  initCallModal();
  initPhoneValidation();
  initFormProtection();
  initSuccessModal();
  initFAQ();
  initReviewsLink();
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

    // Валидация при отправке формы теперь обрабатывается в initSuccessModal()
    // чтобы избежать конфликтов между обработчиками событий
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

  // Функция показа ошибки в модальном окне
  const showErrorModal = (message) => {
    const modalTitle = successModal.querySelector('.success-modal__title');
    const modalText = successModal.querySelector('.success-modal__text');
    const modalIcon = successModal.querySelector('.success-modal__icon');
    
    if (modalTitle && modalText && modalIcon) {
      // Временно меняем содержимое на ошибку
      const originalTitle = modalTitle.textContent;
      const originalText = modalText.innerHTML;
      const originalIcon = modalIcon.innerHTML;
      
      modalTitle.textContent = 'Ошибка';
      modalText.innerHTML = message;
      modalIcon.innerHTML = '✕';
      modalIcon.style.color = '#ff4444';
      
      successModal.style.display = 'block';
      document.body.style.overflow = 'hidden';
      
      // Восстанавливаем оригинальное содержимое при закрытии
      successModal.dataset.isError = 'true';
      successModal.dataset.originalTitle = originalTitle;
      successModal.dataset.originalText = originalText;
      successModal.dataset.originalIcon = originalIcon;
    }
  };

  // Функция закрытия модального окна
  const closeModal = () => {
    // Восстанавливаем оригинальное содержимое, если это было окно ошибки
    if (successModal.dataset.isError === 'true') {
      const modalTitle = successModal.querySelector('.success-modal__title');
      const modalText = successModal.querySelector('.success-modal__text');
      const modalIcon = successModal.querySelector('.success-modal__icon');
      
      if (modalTitle && modalText && modalIcon) {
        modalTitle.textContent = successModal.dataset.originalTitle || 'Спасибо!';
        modalText.innerHTML = successModal.dataset.originalText || 'Форма была успешно отправлена.';
        modalIcon.innerHTML = successModal.dataset.originalIcon || '✓';
        modalIcon.style.color = '';
      }
      
      delete successModal.dataset.isError;
      delete successModal.dataset.originalTitle;
      delete successModal.dataset.originalText;
      delete successModal.dataset.originalIcon;
    }
    
    successModal.style.display = 'none';
    document.body.style.overflow = '';
    // Перенаправляем на главную страницу только если это не ошибка
    if (successModal.dataset.isError !== 'true') {
      window.location.href = window.location.pathname;
    }
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

      // Валидация телефона перед отправкой
      const phoneInput = form.querySelector('input[name="phone"]');
      if (phoneInput) {
        const value = phoneInput.value.trim();
        const digits = value.replace(/\D/g, '');
        const has11Digits = digits.length === 11;
        const startsWithPlus7 = value.startsWith('+7');
        const startsWith8 = value.startsWith('8');

        // Находим или создаем элемент ошибки
        let phoneError = form.querySelector('#phoneError');
        if (!phoneError) {
          phoneError = document.createElement('div');
          phoneError.id = 'phoneError';
          phoneError.style.color = 'whitesmoke';
          phoneError.style.fontWeight = '500';
          phoneError.style.fontSize = 'clamp(1rem, 2.2vw, 1.2rem)';
          phoneError.style.marginTop = '5px';
          phoneError.style.display = 'none';
          phoneError.innerHTML = 'Введите номер в формате: 8 902 560 52 25';

          const button = form.querySelector('button[type="submit"]');
          if (button && button.parentNode) {
            button.parentNode.insertBefore(phoneError, button.nextSibling);
          }
        }

        if (!has11Digits || !(startsWithPlus7 || startsWith8)) {
          phoneError.style.display = 'block';
          return; // Прерываем отправку
        } else {
          phoneError.style.display = 'none';
        }
      }

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
          showErrorModal('Произошла ошибка при отправке формы.<br>Попробуйте позже или позвоните нам напрямую.');
        }
      } catch (error) {
        // Убираем console.error для production
        showErrorModal('Произошла ошибка при отправке формы.<br>Попробуйте позже или позвоните нам напрямую.');
      }
    });
  });
}

// =============================================================================
// FAQ ACCORDION
// =============================================================================

function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  if (faqItems.length === 0) return;
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-item__question');
    
    if (!question) return;
    
    question.addEventListener('click', () => {
      // Закрываем все остальные элементы
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
        }
      });
      
      // Переключаем текущий элемент
      item.classList.toggle('active');
    });
  });
}

// =============================================================================
// ОБРАБОТКА ССЫЛКИ "ОТЗЫВЫ" В БУРГЕР-МЕНЮ
// =============================================================================

function initReviewsLink() {
  const reviewsLinks = document.querySelectorAll('.reviews-link');
  
  reviewsLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const reviewsSection = document.getElementById('reviews');
      
      // Если на текущей странице есть блок отзывов
      if (reviewsSection) {
        // Прокручиваем к блоку отзывов
        reviewsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // Если блока нет, переходим на главную страницу с якорем
        window.location.href = '/#reviews';
      }
    });
  });
}