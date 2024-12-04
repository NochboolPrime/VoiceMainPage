const output = document.getElementById('output');

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'ru-RU'; // Установите язык на русский
recognition.interimResults = false; // Не показывать промежуточные результаты
recognition.maxAlternatives = 1; // Максимальное количество альтернатив

// Функция для начала распознавания
function startRecognition() {
    recognition.start();
    output.textContent = 'Слушаю...';
}

// Обработчик результата распознавания
recognition.onresult = (event) => {
    const command = event.results[0][0].transcript.toLowerCase();
    output.textContent = `Вы сказали: "${command}"`;
    executeCommand(command);
};

// Обработчик ошибок
recognition.onerror = (event) => {
    console.error(`Ошибка распознавания: ${event.error}`);
    
    // Если ошибка "no-speech", просто перезапускаем распознавание
    if (event.error === 'no-speech' || event.error === 'audio-capture' || event.error === 'not-allowed') {
        output.textContent = 'Не удалось распознать речь, повторяю...';
        setTimeout(startRecognition, 1000); // Перезапускаем через 1 секунду
    } else {
        // Для других ошибок также перезапускаем
        setTimeout(startRecognition, 1000); // Перезапускаем через 1 секунду
    }
};

// Функция для выполнения команд
function executeCommand(command) {
    console.log(`Обработанная команда: ${command}`); // Для отладки

    if (command.includes('ассистент.')) {
        speak('Слушаю, хозяин.');
        // Начинаем слушать команды после активации
        setTimeout(() => {
            startRecognition(); // Начинаем прослушивание команд
        }, 1000); // Задержка перед началом прослушивания команд
    } else {
        switch (command) {
            case 'привет.':
                speak('Привет! Как я могу помочь?');
                break;
            case 'как дела.':
                speak('У меня все хорошо, спасибо!');
                break;
            case 'остановить.':
                speak('Остановка работы.');
                recognition.stop();
                break;
            case 'молодец.':
                speak('Спасибо, хозяин ваша похвала самая лучшная награда для меня');
                recognition.stop();
                break;    
            case 'подключение к удаленному компьютеру.':
                speak('Да, хозяин. Открываю подключение к удаленному компьютеру.');
                window.open("https://remotedesktop.google.com/u/2/access/session/1149ae92-0d6e-906e-a774-956a18eff2e8", "_blank");
                break;
            default:
                speak('Команда не распознана.');
                break;
        }
        
        // Перезапускаем распознавание после выполнения команды
        setTimeout(() => {
            startRecognition(); // Начинаем прослушивание команд снова
        }, 1000); // Задержка перед началом нового прослушивания
    }
}

// Функция для озвучивания текста
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Выбор женского голоса
    const voices = speechSynthesis.getVoices();
    
    const femaleVoice = voices.find(voice => voice.name.includes('женский') || voice.name.includes('Google русский'));
    
    if (femaleVoice) {
        utterance.voice = femaleVoice; // Установить женский голос
    }

    window.speechSynthesis.speak(utterance);
}

// Загрузка голосов после их загрузки
speechSynthesis.onvoiceschanged = () => {
    const voices = speechSynthesis.getVoices();
};

// Начальное распознавание при загрузке страницы
startRecognition();
