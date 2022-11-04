function closeModal(modalSelector) {
    const modal = document.querySelector(modalSelector); 
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function openModal(modalSelector, modalTimerId) {
    const modal = document.querySelector(modalSelector); 
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';
    
    console.log(modalTimerId);
    if (modalTimerId) {
        clearInterval(modalTimerId); //если пользователь сам открыл модельное окна, то наш скрипт setTimeout не откроет модально окно
    }
}

function modal(triggerSelector, modalSelector, modalTimerId) {
    // Modal window
    // урок 43

    const modalTrigger = document.querySelectorAll(triggerSelector);
    const modal = document.querySelector(modalSelector); 

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', () => openModal(modalSelector, modalTimerId));
    }); 
        //ВАЖНО!когда в обработчик событий передаем колбэк функцию, мы не должны ее сразу вызывать, должны ее просто объявить, высовется она сама, когда произойдет клик
        //поэтому мы создали еще одну стрелочкую функцию, которая оборачивает нашу функцию и будет выполняться после клика

        //const modalTimerId = setTimeout(openModal, 50000);    //урок 44
        // переносим modalTimerId в файл script.js

    modal.addEventListener('click', (e) => { // функция, чтобы модальное окно закрывалось по клику на подложку
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModal(modalSelector); // тут функцию closeModal вызываем, т.к. нам нужно ее выполнить после условия!
        }
    });
   
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) { //Закрытие модального окна при нажатии на клавиатуре ESC
            closeModal(modalSelector);
        }
    });

    //Урок 44
    // когда пользователь долистает страницу доконца, появится модальное окно showModalByScroll, но при этом как только сработает условие, мы удаляем обрабочиком события функцию showModalByScroll
    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal(modalSelector, modalTimerId);
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);    
}

export default modal;
export {closeModal};
export {openModal};