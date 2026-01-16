// =============
// Инициализация после загрузки DOM
// =============
document.addEventListener('DOMContentLoaded', function () {
  initGallery();
  initBurgerMenu();
  initCallModal();
  initPhoneValidation(); // ← добавлена валидация телефона
});

// =============
// Галерея (Lightbox)
// =============
function initGallery() {
  // Отключаем галерею на мобильных и планшетах
  if (window.innerWidth < 768) {
    return;
  }

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

  images.forEach((img, index) => {
    img.addEventListener('click', () => {
      currentIndex = index;
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      imageModal.style.display = 'block';
      updateCounter();
      document.body.style.overflow = 'hidden';
    });
  });

  function updateCounter() {
    if (counter) {
      counter.textContent = `${currentIndex + 1} / ${images.length}`;
    }
  }

  const closeModal = () => {
    imageModal.style.display = 'none';
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal) closeModal();
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
      modalImg.src = images[currentIndex].src;
      modalImg.alt = images[currentIndex].alt;
      updateCounter();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
      modalImg.src = images[currentIndex].src;
      modalImg.alt = images[currentIndex].alt;
      updateCounter();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (imageModal.style.display !== 'block') return;
    if (e.key === 'ArrowLeft') prevBtn?.click();
    if (e.key === 'ArrowRight') nextBtn?.click();
    if (e.key === 'Escape') closeModal();
  });
}

// =============
// Бургер-меню
// =============
function initBurgerMenu() {
  const burger = document.querySelector('.burger');
  const mobileMenu = document.querySelector('.mobile-menu');

  // Если элементов нет — выходим
  if (!burger || !mobileMenu) return;

  // Переключение меню
  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
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

// =============
// Попап "Вызвать мастера"
// =============
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

// =============
// Умное форматирование и валидация номера телефона
// =============
function initPhoneValidation() {
  const form = document.getElementById('requestForm');
  if (!form) return;

  const nameInput = form.querySelector('input[name="name"]');
  const phoneInput = form.querySelector('input[name="phone"]');
  const submitButton = form.querySelector('.request_button');

  // Создаём элемент для ошибки (просто текст под формой)
  let phoneError = form.querySelector('#phoneError');
  if (!phoneError) {
    phoneError = document.createElement('div');
    phoneError.id = 'phoneError';
    phoneError.style.color = 'orange';                 // белый текст
    phoneError.style.fontWeight = '500';              // средняя жирность
    phoneError.style.fontSize = 'clamp(1rem, 2.2vw, 1.4rem)';
    phoneError.style.marginTop = '5px';
    phoneError.style.display = 'none';
    phoneError.innerHTML = 'Введите номер в формате: 8 902 560 52 25';
    
    // Вставляем после кнопки отправки
    const button = form.querySelector('button[type="submit"]');
    if (button) {
      button.parentNode.insertBefore(phoneError, button.nextSibling);
    }
  }

  // === Запрет цифр в имени ===
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      nameInput.value = nameInput.value.replace(/\d/g, '');
    });
  }

  // === Форматирование телефона ===
  if (phoneInput) {
    let isDeleting = false;

    phoneInput.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' || e.key === 'Delete') {
        isDeleting = true;
      }
    });

    phoneInput.addEventListener('input', () => {
      let value = phoneInput.value;
      
      // Удаляем всё, кроме цифр, + и пробелов
      value = value.replace(/[^\d+\s]/g, '');
      
      // Убираем множественные пробелы
      value = value.replace(/\s+/g, ' ');
      
      // Извлекаем только цифры
      const digits = value.replace(/\D/g, '');
      
      let formatted = '';
      
      if (digits.startsWith('7') && digits.length >= 1) {
        // Формат +7 XXX XXX XX XX
        formatted = '+7';
        if (digits.length > 1) formatted += ' ' + digits.slice(1, 4);
        if (digits.length > 4) formatted += ' ' + digits.slice(4, 7);
        if (digits.length > 7) formatted += ' ' + digits.slice(7, 9);
        if (digits.length > 9) formatted += ' ' + digits.slice(9, 11);
      } else if (digits.startsWith('8') && digits.length >= 1) {
        // Формат 8 XXX XXX XX XX
        formatted = '8';
        if (digits.length > 1) formatted += ' ' + digits.slice(1, 4);
        if (digits.length > 4) formatted += ' ' + digits.slice(4, 7);
        if (digits.length > 7) formatted += ' ' + digits.slice(7, 9);
        if (digits.length > 9) formatted += ' ' + digits.slice(9, 11);
      } else if (digits.length > 0) {
        // Если не начинается с 7 или 8, просто показываем цифры
        formatted = digits;
        if (digits.length > 3) formatted = digits.slice(0, 3) + ' ' + digits.slice(3, 6);
        if (digits.length > 6) formatted = digits.slice(0, 3) + ' ' + digits.slice(3, 6) + ' ' + digits.slice(6, 8);
        if (digits.length > 8) formatted = digits.slice(0, 3) + ' ' + digits.slice(3, 6) + ' ' + digits.slice(6, 8) + ' ' + digits.slice(8, 10);
      }

      // Сохраняем позицию курсора
      const start = phoneInput.selectionStart;
      const end = phoneInput.selectionEnd;

      phoneInput.value = formatted;

      // Восстанавливаем курсор в конец
      if (!isDeleting) {
        phoneInput.setSelectionRange(formatted.length, formatted.length);
      }
      isDeleting = false;
    });
  }

  // === Отправка формы ===
  form.addEventListener('submit', (e) => {
    let isValid = true;

    if (phoneInput) {
      const value = phoneInput.value.trim();
      const digits = value.replace(/\D/g, '');
      
      // Проверяем: ровно 11 цифр
      const has11Digits = digits.length === 11;
      
      // Проверяем начало: либо +7..., либо 8...
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
