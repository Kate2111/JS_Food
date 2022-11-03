/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/modules/calc.js":
/*!********************************!*\
  !*** ./src/js/modules/calc.js ***!
  \********************************/
/***/ ((module) => {

function calc() {
    // Урок 66 - калькулятор

    // Calc
    const result = document.querySelector('.calculating__result span');
    let sex, height, weight, age, ratio;
    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }

    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = '1.375';
        localStorage.setItem('ratio', '1.375');
    }
      
    function initLocalSettings(selector, activClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.classList.remove(activClass);
            if (elem.getAttribute('id') === localStorage.getItem('sex')) {
                elem.classList.add(activClass);
            }
            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                elem.classList.add(activClass);
            }
        });
    }

    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    //формула подсчета, нужно учесть, чтобы расчет был только при условии всех заполненных данных
    function calcTotal() {
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = '____';
            return;  // логическая проверка на заполнение данных, если данные не заполнены, функкция остановится и результат будет ____
        }

        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    calcTotal();

    //получение значений с элементов на странице 
    //фунция по работе с div (статический элемент)
    function getStaticInformation(selector, activClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));//сохраняем инф в локальной БД
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', e.target.getAttribute('id')); //сохраняем инф в локальной БД
                }
    
                elements.forEach(elem => {
                    elem.classList.remove(activClass);
                });
    
                e.target.classList.add(activClass);
    
                calcTotal();
            });
        });
    }
    getStaticInformation('#gender div', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');

    //получение значений с элементов на странице 
    //фунция по работе с input
    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);

        //проверка через регулярные выражения на на,чтобы в input были прописаны только цифры, если есть буквы,окошко будет красным
        input.addEventListener('input', () => {
            if (input.value.match(/\D/g)) {
                input.style.border = '1px solid red';
            } else {
                input.style.border = 'none';
            }
            
            //т.к. мы не знаем с какой переменной нам необходимо работать, нам нужно проверить соотвествие строки назначенному id и записать данные в переменную
            switch(input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;        
            }

            calcTotal();
        });
    }

    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');
}

module.exports = calc;

/***/ }),

/***/ "./src/js/modules/cards.js":
/*!*********************************!*\
  !*** ./src/js/modules/cards.js ***!
  \*********************************/
/***/ ((module) => {

function cards() {
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

    async function getResource(url) {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        }); 
}

module.exports = cards;

/***/ }),

/***/ "./src/js/modules/forms.js":
/*!*********************************!*\
  !*** ./src/js/modules/forms.js ***!
  \*********************************/
/***/ ((module) => {

function forms() {
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
}

module.exports = forms;

/***/ }),

/***/ "./src/js/modules/modal.js":
/*!*********************************!*\
  !*** ./src/js/modules/modal.js ***!
  \*********************************/
/***/ ((module) => {

function modal() {
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
}

module.exports = modal;

/***/ }),

/***/ "./src/js/modules/slider.js":
/*!**********************************!*\
  !*** ./src/js/modules/slider.js ***!
  \**********************************/
/***/ ((module) => {

function slider() {
    // slider
    // Урок 61 - 1 вариант slider

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

    //Урок 62 - 2 вариант slider
    // В этом варианте, дополнительно добавили обертку "offer__slider-inner" в html 

    const slides = document.querySelectorAll('.offer__slide');
    const slider = document.querySelector('.offer__slider'); //Переменная для создания точек
    const prev = document.querySelector('.offer__slider-prev');
    const next = document.querySelector('.offer__slider-next');
    const total = document.querySelector('#total');
    const current  = document.querySelector('#current');
    const slidesWrapper = document.querySelector('.offer__slider-wrapper'); //назначим свойство , это значит, что все что не подходит под ширину этого блока, будет скрыто и невидимо для пользователя 
    const slidesField = document.querySelector('.offer__slider-inner');
    const width = window.getComputedStyle(slidesWrapper).width;// будем использовать Computed styles - примененные стили от css, их можем получать при помощи скриптов
    let slideIndex = 1; 
    let offset = 0;

    if (slides.length < 10) {
        total.textContent = `0${slides.length}`;
        current.textContent = `0${slideIndex}`;
    } else { 
        total.textContent = slides.length;
        current.textContent = slideIndex;
    }

    //Устанавливаем блоку ширину,чтобы мы могли полностью поместить все слайды в slidesField
    slidesField.style.width = 100 * slides.length + '%'; //используем %,так как прописываем css стили
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';
    
    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = width; //устанавливаем ширину каждому отдельному слайду
    });

    slider.style.position = 'relative'; 

    const indicators = document.createElement('ol');
    const dots = [];
    indicators.classList.add('carousel-indicators');
    indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;
    slider.append(indicators);
    

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li'); //для правильной симантики создаем лист item
        dot.setAttribute('data-slide-to', i + 1); //присвоение к каждой точке соответствующего номера слайда
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `;
        if (i == 0) {
            dot.style.opacity = 1;
        }
        indicators.append(dot);
        dots.push(dot);
    }
    
    
    function translateSlides() {
        //сдвигаем слайды на ширину слайда
        slidesField.style.transform = `translateX(-${offset}px)`;
    }

    function numberCounter() {
        //отображает номер текущего слайда
        if (slides.length < 10) {
            current.textContent =  `0${slideIndex}`;
        } else {
            current.textContent =  slideIndex;
        }

        //прозрачность точек
        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = 1;
    }

    function withoutDigits(str) {
        return +str.replace(/\D/g, '');
    }

     //обработчик собитий чтобы передвигать слайдер вперед
     //offset == (+width.slice(0, width.length - 2) * (slides.length - 1)) - корректируем используя регулярные выражения(ниже)
     //результат: offset == (+width.replace(/\D/g, '') * (slides.length - 1)) - заменяем D(не числа-буквы) на пустую строку 
     next.addEventListener('click', () => {
        if (offset == (withoutDigits(width) * (slides.length - 1))) {
            offset = 0;
        } else {
            offset += withoutDigits(width); 
        }
        translateSlides();
        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }
        numberCounter();
    });

    //обработчик собитий чтобы передвигать слайдер назад
    prev.addEventListener('click', () => {
        if (offset == 0) {
            offset = withoutDigits(width) * (slides.length - 1);
        } else {
            offset -= withoutDigits(width);
        }
        translateSlides();
        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }
        numberCounter();
    });    

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');

            slideIndex = slideTo;
            offset = withoutDigits(width) * (slideTo - 1);

            translateSlides();
            numberCounter();
        });
    });

}

module.exports = slider;

/***/ }),

/***/ "./src/js/modules/tabs.js":
/*!********************************!*\
  !*** ./src/js/modules/tabs.js ***!
  \********************************/
/***/ ((module) => {

function tabs() {
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
}

module.exports = tabs;

/***/ }),

/***/ "./src/js/modules/timer.js":
/*!*********************************!*\
  !*** ./src/js/modules/timer.js ***!
  \*********************************/
/***/ ((module) => {

function timer() {
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
}

module.exports = timer;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**************************!*\
  !*** ./src/js/script.js ***!
  \**************************/
window.addEventListener('DOMContentLoaded', () => {
    const calc = __webpack_require__(/*! ./modules/calc */ "./src/js/modules/calc.js");
    const cards = __webpack_require__(/*! ./modules/cards */ "./src/js/modules/cards.js");
    const forms = __webpack_require__(/*! ./modules/forms */ "./src/js/modules/forms.js");
    const modal = __webpack_require__(/*! ./modules/modal */ "./src/js/modules/modal.js");
    const slider = __webpack_require__(/*! ./modules/slider */ "./src/js/modules/slider.js");
    const tabs = __webpack_require__(/*! ./modules/tabs */ "./src/js/modules/tabs.js");
    const timer = __webpack_require__(/*! ./modules/timer */ "./src/js/modules/timer.js");

    calc();
    cards();
    forms();
    modal();
    slider();
    tabs();
    timer();
});



})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map