function slider({container, slide, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, field}) {
    // slider

    //Урок 62 - 2 вариант slider
    // В этом варианте, дополнительно добавили обертку "offer__slider-inner" в html 

    const slides = document.querySelectorAll(slide);
    const slider = document.querySelector(container); //Переменная для создания точек
    const prev = document.querySelector(prevArrow);
    const next = document.querySelector(nextArrow);
    const total = document.querySelector(totalCounter);
    const current  = document.querySelector(currentCounter);
    const slidesWrapper = document.querySelector(wrapper); //назначим свойство , это значит, что все что не подходит под ширину этого блока, будет скрыто и невидимо для пользователя 
    const slidesField = document.querySelector(field);
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

export default slider;