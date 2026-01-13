// chatbot.js — автоматический чат-бот с эффектом набора текста
class ChatBot {
    constructor() {
        this.step = 0;
        this.data = {};
        this.messages = document.getElementById('chat-messages');
        this.input = document.getElementById('chat-input');
        this.widget = document.getElementById('chat-widget');
        this.toggle = document.getElementById('chat-toggle');

        // Показываем чат через 3 секунды
        setTimeout(() => {
            this.showChat();
            this.loadInitialMessage();
        }, 3000);

        // Обработчик клика на кнопку
        this.toggle.addEventListener('click', () => {
            if (this.widget.style.display === 'none') {
                this.showChat();
                this.loadInitialMessage();
            } else {
                this.hideChat();
            }
        });

        // Обработчик ввода
        this.input.addEventListener('keypress', (e) => {
            if (e.key !== 'Enter') return;
            const value = this.input.value.trim();
            if (!value) return;

            this.addMessage(value, true);
            this.input.value = '';

            this.handleStep(value);
        });
    }

    showChat() {
        this.widget.style.display = 'block';
        this.toggle.style.opacity = '1';
    }

    hideChat() {
        this.widget.style.display = 'none';
        this.toggle.style.opacity = '0.8';
    }

    async loadInitialMessage() {
        if (this.step === 0) {
            const text = 'Здравствуйте! 👋\nМеня зовут Алина, я помогу вам оформить заявку на перетяжку или ремонт мебели.\n\nКакой вид работ вас интересует?\n1. Полная перетяжка\n2. Частичная перетяжка\n3. Замена наполнителя\n4. Ремонт каркаса';

            // Эффект посимвольного набора
            await this.typeMessage(text);
            this.step = 1;
        }
    }

    // Функция для посимвольного набора текста с поддержкой \n
    async typeMessage(text) {
        this.messages.innerHTML = ''; // Очищаем предыдущие сообщения

        const el = document.createElement('div');
        el.style.padding = '8px 0';
        el.style.textAlign = 'left';
        el.style.color = '#ffffff';
        el.innerHTML = '';
        this.messages.appendChild(el);

        let currentHTML = '';

        for (let i = 0; i < text.length; i++) {
            if (text[i] === '\n') {
                currentHTML += '<br>';
            } else {
                currentHTML += text[i];
            }
            el.innerHTML = currentHTML;
            this.messages.scrollTop = this.messages.scrollHeight;
            await this.sleep(40); // Задержка 40 мс между символами
        }
    }

    addMessage(text, isUser = false) {
        const el = document.createElement('div');
        el.style.padding = '8px 0';
        el.style.textAlign = isUser ? 'right' : 'left';
        el.style.color = isUser ? '#000' : '#ffffff';
        el.innerHTML = text.replace(/\n/g, '<br>');
        this.messages.appendChild(el);
        this.messages.scrollTop = this.messages.scrollHeight;
    }

    async handleStep(value) {
        if (this.step === 1) {
            const options = {
                '1': 'Полная перетяжка',
                '2': 'Частичная перетяжка',
                '3': 'Замена наполнителя',
                '4': 'Ремонт каркаса'
            };
            if (options[value]) {
                this.data.work = options[value];
                await this.typeMessage(`Отлично! Вы выбрали: «${this.data.work}».\n\nПожалуйста, укажите адрес, где находится мебель (город, район, улица):`);
                this.step = 2;
            } else {
                this.addMessage('Пожалуйста, введите цифру от 1 до 4.');
            }
        } else if (this.step === 2) {
            this.data.address = value;
            await this.typeMessage(`Спасибо! Адрес: ${value}.\n\nТеперь введите ваш номер телефона (мы подставим +7 автоматически):`);
            this.step = 3;
        } else if (this.step === 3) {
            const cleanPhone = value.replace(/\D/g, '');
            const fullPhone = '+7' + (cleanPhone.length > 10 ? cleanPhone.slice(-10) : cleanPhone).padStart(10, '0');
            this.data.phone = fullPhone;

            try {
                const res = await fetch('http://localhost:5000/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(this.data)
                });

                if (res.ok) {
                    await this.typeMessage(`✅ Заявка отправлена!\nМастер свяжется с вами в течение 30 минут по номеру ${fullPhone}.\nХорошего дня! 😊`);
                } else {
                    this.addMessage('❌ Произошла ошибка. Попробуйте позже или позвоните напрямую.');
                }
            } catch (err) {
                this.addMessage('❌ Нет соединения. Попробуйте позже.');
            }

            this.step = 0;
            // Скрываем чат через 3 секунды
            setTimeout(() => {
                this.hideChat();
            }, 3000);
        }
    }

    // Вспомогательная функция для задержки
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new ChatBot();
});