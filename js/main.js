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
    /* const modalCloseBtn = document.querySelector('[data-close]'); */  //в уроке 54 удаляем переменную, так каксоздаем закрытие окна для динамически созданного элемента

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
        btn.addEventListener('click', openModal); 
    });

    const modalTimerId = setTimeout(openModal, 50000);    //урок 44

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

    /* modalCloseBtn.addEventListener('click', closeModal);  */// функцию closeModal мы не вызываем! а только передаем!  //в уроке 54 удаляем

    modal.addEventListener('click', (e) => { // функция, чтобы модальное окно закрывалось по клику на подложку
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
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
            this.price = this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');

            if(this.classes.length === 0) {
                this.classes = 'menu__item';
                element.classList.add(this.classes);
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

    getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, '.menu.container').render();
            });
        });
    

     //Урок 53
    // Создание форм и отправка данных на сервер 
    // Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'icons/veg.svg',
        success: 'Спасибо! Скоро мы свяжемся с вами',
        failure: 'Что-то пошло не так...',
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: data
        });

        return await res.json();
    };

    async function getResource(url) {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    //функция которая отвечает за постинг данных
    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // отменяем стандартное поведение браузера, нужно прописывать в начале 

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);
            /*  //убираем, так как будем использовать fetch
            const request = new XMLHttpRequest();
            request.open('POST', 'server.php'); //сначала вызываем метод open, чтобы настроить наш запрос
             */
                      
            const formData = new FormData(form);
            
            /* const object = {};
            formData.forEach(function(value, key) {
                object[key] = value;
            }); */

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset();
            });
        });
    }
    
    //Урок 54. Красивое оповещение пользователя
    
    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        //создаем блок и присваеваем классы
        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">                  
                <div data-close class="modal__close">&times;</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }

    // Урок 56. Fetch API and promice

    /* fetch('http://localhost:3000/menu', {
        method: "POST",
        body: JSON.stringify({name: 'Alex'}),
        headers: {
            'Content-type': 'applicatiom/json'
        }
    })
        .then(response => response.json())
        .then(json => console.log(json)) */

    
    // slider
    // Урок 61 - 1 вариант

    /* 
    const slides = document.querySelectorAll('.offer__slide');
    const prev = document.querySelector('.offer__slider-prev');
    const next = document.querySelector('.offer__slider-next');
    const total = document.querySelector('#total');
    const current  = document.querySelector('#current');
    let slideIndex = 1; 

    showSlides(slideIndex);

    if (slides.length < 10) {
        total.textContent = `0${slides.length}`;
    } else { 
        total.textContent = slides.length;
    }

    function showSlides(n)  {
        if (n > slides.length) {
            slideIndex = 1;
        }

        if (n < 1) {
            slideIndex = slides.length;
        }

        slides.forEach(item => item.style.display = 'none');

        slides[slideIndex - 1].style.display = 'block';

        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else { 
            current.textContent = slideIndex;
        } 
    }

    function plusSlides(n) {
        showSlides(slideIndex += n);
    }

    next.addEventListener('click', () => {
        plusSlides(1);
    });

    prev.addEventListener('click', () => {
        plusSlides(-1);
    });
 */

    //Урок 62 - 2 вариант

    const slides = document.querySelectorAll('.offer__slide');
    const prev = document.querySelector('.offer__slider-prev');
    const next = document.querySelector('.offer__slider-next');
    const total = document.querySelector('#total');
    const current  = document.querySelector('#current');
    const slidesWrapper = document.querySelector('.offer__slider-wrapper');
    const slidesField = document.querySelector('.offer__slider-inner');
    const width = window.getComputedStyle(slidesWrapper).width;
    let slideIndex = 1; 


    slidesField.style.width = 100 * slides.length + '%';
    slides.forEach(slode => {
        slideIndex.style.width = width;
    });

});


