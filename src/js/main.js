window.addEventListener('DOMContentLoaded', () => {


    //Tabs
    const tabs = document.querySelectorAll('.tabheader__item');
    const tabsContent = document.querySelectorAll('.tabcontent');
    const tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent(0);

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });


    //Timer

    const deadline = '2022-07-31';

    function getTimeRemaining(endtime) { //задача функции получить разницу между датам
        //Date.parse(endtime) - получим колво милисекнд планируемой даты
        //Date.parse(new Date()) - текущая дата
        //Math.floor - округление до ближайшего целого
        const t = Date.parse(endtime) - Date.parse(new Date()); 
        const days = Math.floor(t / (1000 * 60 * 60 * 24)); // получаем сколько в сутках милисекунд
        const hours = Math.floor((t / (1000 * 60 * 60)) % 24); //% - возвращает остаток от деления
        const minutes = Math.floor((t / 1000 / 60) % 60);
        const seconds = Math.floor((t / 1000) % 60);

        return {
            'total': t, //показывает общее количество милисекунд
            days, //'days': days, старый синтаксис
            hours, //'hours': hours,
            minutes, //'minutes': minutes,
            seconds, //'seconds': seconds,
        };
    }
    
    function getZero(num) { //функция для добавления нуля перед числом, если число меньше 10, например 08,09
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) { //функция выводит таймер на страницу
        const timer = document.querySelector(selector);
        const days = timer.querySelector('#days');
        const hours = timer.querySelector('#hours');
        const minutes = timer.querySelector('#minutes');
        const seconds = timer.querySelector('#seconds');
        const timeInterval = setInterval(updateClock, 1000); //запускаем таймер через каждую секунду

        updateClock(); //запускаем функцию вручную, чтобы устранить мегание

        function updateClock() { // Обновление часов , расчет времени на данную секунду 
            const t = getTimeRemaining(endtime); // разница между текущим и планируемым временем

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);


    // Modal window
    // урок 43

    const modalTrigger = document.querySelectorAll('[data-modal]');
    const modal = document.querySelector('.modal'); 
    const modalCloseBtn = document.querySelector('[data-close]');

    // т.к. код ниже используется два раза и более, нам необъодимо его вынести в отдельную функцию

    /* 
    modalTrigger.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.add('show');
            modal.classList.remove('hide');
            // modal.classList.toggle('show'); //второй спопособ через toggle, нужно обязательно прописать класс show в html для .modal   
            document.body.style.overflow = 'hidden'; //выключаем скролл сайта при открытом модальном окне
        });
    });
    */

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId); //если пользователь сам открыл модельное окна, то наш скрипт setTimeout не откроет модально окно
    }

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal) 
    });

    /* const modalTimerId = setTimeout(openModal, 3000);  */  //урок 44

    // т.к. код ниже используется два раза и более, нам необъодимо его вынести в отдельную функцию

    /* 
    modalCloseBtn.addEventListener('click', () => {
        modal.classList.add('hide');
        modal.classList.remove('show');
        // modal.classList.toggle('show'); 
        document.body.style.overflow = ''; //возвращаем скролл, пустые ковычки '' - браузер сам определит что подставить
    });

    modal.addEventListener('click', (e) => {    // функция, чтобы модальное окно закрывалось по клику на подложку
        if (e.target === modal) {
            modal.classList.add('hide');
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    })
    */

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    modalCloseBtn.addEventListener('click', closeModal); // функцию closeModal мы не вызываем! а только передаем! 

    modal.addEventListener('click', (e) => { // функция, чтобы модальное окно закрывалось по клику на подложку
        if (e.target === modal) {
            closeModal(); // тут функцию closeModal вызываем, т.к. нам нужно ее выполнить после условия!
        }
    });
   
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) { //Закрытие модального окна при нажатии на клавиатуре ESC
            closeModal();
        }
    });

    //Урок 44
    // когда пользователь долистает страницу доконца, появится модальное окно showModalByScroll, но при этом как только сработает условие, мы удаляем обрабочиком события функцию showModalByScroll
    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    // Используем классы для карточек
    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 58;
            this.changeToRUS();
        }

        changeToRUS() {
            this.price = this.price * this.transfer
        }

        render() {
            const element = document.createElement('div');

            if(this.classes.length === 0) {
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена</div>
                    <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        '.menu .container',
    ).render();

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню "Премиум"',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        12,
        '.menu .container',
    ).render();

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        7,
        '.menu .container',
    ).render();

    //Урок 53
    // Создание форм и отправка данных на сервер 
    // Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'Загрузка',
        succsess: 'Спасибо! Скоро мы свяжемся с вами',
        failure: 'Что-то пошло не так...',
    }

    forms.forEach(item => {
        posrData(item);
    });

    //функция которая отвечает за постинг данных
    function posrData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // отменяем стандартное поведение браузера, нужно прописывать в начале 

            const statusMessage = document.createElement('div');
            statusMessage.classList.add('status');
            statusMessage.textContent = message.loading;
            form.append(statusMessage);

            const request = new XMLHttpRequest();
            request.open('POST', 'server.php'); //сначала вызываем метод open, чтобы настроить наш запрос
            
            request.setRequestHeader('Content-type', 'application/json');            
            const formData = new FormData(form);

            const object = {};
            formData.forEach(function(value, key) {
                object[key] = value;
            });

            request.send(formData);

            request.addEventListener('load', () => {
                if (request.status === 200) {
                    console.log(request.response);
                    form.reset();
                    setTimeout(() => {
                        statusMessage.remove();
                    }, 2000);
                } else {
                    statusMessage.textContent = message.failure
                }
            });
        });
    }

});
