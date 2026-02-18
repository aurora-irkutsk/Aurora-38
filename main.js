// =============================================================================
// ИНИЦИАЛИЗАЦИЯ ПОСЛЕ ЗАГРУЗКИ DOM
// =============================================================================

document.addEventListener('DOMContentLoaded', function () {
  initGallery();
  initBurgerMenu();
  initCallModal();
  initPhoneValidation();
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

  // Переменная для хранения функции удаления trap focus
  let removeCallTrapFocus = null;
  
  const openCallModal = () => {
    callModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Активируем trap focus
    const modalContent = callModal.querySelector('.modal__content');
    if (modalContent) {
      removeCallTrapFocus = trapFocus(modalContent);
    }
    
    // Устанавливаем фокус на первое поле формы
    setTimeout(() => {
      const firstInput = callModal.querySelector('input[name="name"]');
      if (firstInput) firstInput.focus();
    }, 100);
  };

  const closeCallModal = () => {
    callModal.style.display = 'none';
    document.body.style.overflow = '';
    
    // Удаляем trap focus при закрытии
    if (removeCallTrapFocus) {
      removeCallTrapFocus();
      removeCallTrapFocus = null;
    }
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

// Вспомогательная функция для создания элемента ошибки валидации телефона
function createPhoneError(form) {
  let phoneError = form.querySelector('#phoneError');
  
  if (!phoneError) {
    phoneError = document.createElement('div');
    phoneError.id = 'phoneError';
    phoneError.style.color = '#7FFF00';
    phoneError.style.textShadow = '0 0 10px rgba(127, 255, 0, 0.5)';
    phoneError.style.fontWeight = '500';
    phoneError.style.fontSize = 'clamp(1rem, 2.2vw, 1.2rem)';
    phoneError.style.marginTop = '5px';
    phoneError.style.display = 'none';
    phoneError.style.textAlign = 'center';
    phoneError.innerHTML = 'Формат ввода: 8 902 560 52 25';

    const button = form.querySelector('button[type="submit"]');
    if (button) {
      button.parentNode.insertBefore(phoneError, button.nextSibling);
    }
  }
  
  return phoneError;
}

function initPhoneValidation() {
  // Функция инициализации одной формы
  function setupForm(form) {
    if (!form) return;

    const nameInput = form.querySelector('input[name="name"]');
    const phoneInput = form.querySelector('input[name="phone"]');
    const submitButton = form.querySelector('.request__button') || form.querySelector('.modal__button');
    
    // Создаём элемент ошибки через вспомогательную функцию
    const phoneError = createPhoneError(form);

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
// ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ: TRAP FOCUS (удержание фокуса внутри модального окна)
// =============================================================================

function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  };

  element.addEventListener('keydown', handleTabKey);
  
  // Возвращаем функцию для удаления обработчика
  return () => element.removeEventListener('keydown', handleTabKey);
}

// =============================================================================
// МОДАЛЬНОЕ ОКНО ОШИБОК
// =============================================================================

function showErrorModal(message) {
  // Создаем модальное окно ошибки, если его еще нет
  let errorModal = document.getElementById('errorModal');
  
  if (!errorModal) {
    errorModal = document.createElement('div');
    errorModal.id = 'errorModal';
    errorModal.className = 'success-modal';
    errorModal.innerHTML = `
      <div class="success-modal__content">
        <span class="success-modal__close" id="closeErrorModal">&times;</span>
        <div class="success-modal__icon" style="background: #ff4444;">✗</div>
        <h3 class="success-modal__title">Ошибка</h3>
        <p class="success-modal__text" id="errorModalText"></p>
        <button class="success-modal__button" id="errorModalBtn">Понятно</button>
      </div>
    `;
    document.body.appendChild(errorModal);
    
    // Обработчики закрытия
    const closeErrorModal = () => {
      errorModal.style.display = 'none';
      document.body.style.overflow = '';
    };
    
    errorModal.querySelector('#closeErrorModal').addEventListener('click', closeErrorModal);
    errorModal.querySelector('#errorModalBtn').addEventListener('click', closeErrorModal);
    errorModal.addEventListener('click', (e) => {
      if (e.target === errorModal) closeErrorModal();
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && errorModal.style.display === 'block') {
        closeErrorModal();
      }
    });
  }
  
  // Устанавливаем текст и показываем
  document.getElementById('errorModalText').textContent = message;
  errorModal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  
  // Активируем trap focus
  const removeTrapFocus = trapFocus(errorModal.querySelector('.success-modal__content'));
  
  // Устанавливаем фокус на кнопку "Понятно"
  setTimeout(() => {
    const errorBtn = document.getElementById('errorModalBtn');
    if (errorBtn) errorBtn.focus();
  }, 100);
  
  // Удаляем trap focus при закрытии
  const originalClose = errorModal.style.display;
  const observer = new MutationObserver(() => {
    if (errorModal.style.display === 'none' && originalClose === 'block') {
      removeTrapFocus();
      observer.disconnect();
    }
  });
  observer.observe(errorModal, { attributes: true, attributeFilter: ['style'] });
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

  // Переменная для хранения функции удаления trap focus
  let removeSuccessTrapFocus = null;
  
  // Функция открытия модального окна
  const openSuccessModal = () => {
    successModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Активируем trap focus
    const modalContent = successModal.querySelector('.success-modal__content');
    if (modalContent) {
      removeSuccessTrapFocus = trapFocus(modalContent);
    }
    
    // Устанавливаем фокус на кнопку "Вернуться на сайт"
    setTimeout(() => {
      if (successModalBtn) successModalBtn.focus();
    }, 100);
  };

  // Функция закрытия модального окна
  const closeModal = () => {
    successModal.style.display = 'none';
    document.body.style.overflow = '';
    
    // Удаляем trap focus при закрытии
    if (removeSuccessTrapFocus) {
      removeSuccessTrapFocus();
      removeSuccessTrapFocus = null;
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

      // Блокировка кнопки отправки
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
      }

      // Валидация телефона перед отправкой
      const phoneInput = form.querySelector('input[name="phone"]');
      if (phoneInput) {
        const value = phoneInput.value.trim();
        const digits = value.replace(/\D/g, '');
        const has11Digits = digits.length === 11;
        const startsWithPlus7 = value.startsWith('+7');
        const startsWith8 = value.startsWith('8');

        // Находим или создаем элемент ошибки через вспомогательную функцию
        const phoneError = createPhoneError(form);

        if (!has11Digits || !(startsWithPlus7 || startsWith8)) {
          phoneError.style.display = 'block';
          // Разблокируем кнопку при ошибке валидации
          if (submitButton) {
            submitButton.disabled = false;
          }
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
          if (submitButton) {
            submitButton.disabled = false;
          }
          showErrorModal('Произошла ошибка при отправке формы. Попробуйте позже или позвоните нам напрямую.');
        }
      } catch (error) {
        console.error('Ошибка:', error);
        if (submitButton) {
          submitButton.disabled = false;
        }
        showErrorModal('Произошла ошибка при отправке формы. Попробуйте позже или позвоните нам напрямую.');
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