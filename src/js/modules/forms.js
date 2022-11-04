import {closeModal, openModal} from './modal';
import {postData} from '../services/services';

function forms(formSelector, modalTimerId) {
    //Урок 53
    // Создание форм и отправка данных на сервер 
    // Forms

    const forms = document.querySelectorAll(formSelector);

    const message = {
        loading: 'icons/veg.svg',
        success: 'Спасибо! Скоро мы свяжемся с вами',
        failure: 'Что-то пошло не так...',
    };

    forms.forEach(item => {
        bindPostData(item);
    });


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
        openModal('.modal', modalTimerId);

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
            closeModal('.modal');
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

export default forms;