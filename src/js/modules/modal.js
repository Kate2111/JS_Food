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