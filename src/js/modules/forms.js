import {closeModal, openModal} from './modal';
import {postData} from '../services/services';
import {registrationUser, authorizationUser} from '../services/registration';

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
            e.preventDefault(); 

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);
                      
            const formData = new FormData(form);
            const formDataForAuth = Object.fromEntries(formData.entries());
            const json = JSON.stringify(formDataForAuth);

            if(form.classList.contains('modal__form')) {
                console.log('postData')
                    postData(json)
                    .then(() => {
                        showThanksModal(message.success, '.modal__dialog', '.modal', 'modal__dialog');
                        statusMessage.remove();
                    }).catch(() => {
                        showThanksModal(message.failure, '.modal__dialog', '.modal', 'modal__dialog');
                    }).finally(() => {
                        form.reset();
                    });
            } 
            if(form.classList.contains('auth__form')) {
                console.log('authData')
                authorizationUser(formDataForAuth.email, formDataForAuth.name ,formDataForAuth.password)
                .then((user) => {
                    console.log(user);
                    window.location.href = 'personalPage.html';
                }).catch(() => {
                    showThanksModal('Пользователь с таким e-mail уже зарегистрирован', '.auth__dialog', '.auth');
                }).finally(() => {
                    form.reset();
                }); 
            }
            if(form.classList.contains('registration__form')) {
                console.log('regData')
                registrationUser(formDataForAuth.email, formDataForAuth.name ,formDataForAuth.password)
                .then((user) => {
                    console.log(user);
                    showThanksModal('Вы успешно зарегистрировались', '.auth__dialog', '.auth');
                }).catch(() => {
                    showThanksModal('Пользователь с таким e-mail уже зарегистрирован', '.auth__dialog', '.auth');
                }).finally(() => {
                    form.reset();
                });
            }
        });
    }
    
    //Урок 54. Красивое оповещение пользователя
    
    function showThanksModal(message, dialogFormSelector, formMainClass, dialogForm) {
        const prevModalDialog = document.querySelector(dialogFormSelector);

        prevModalDialog.classList.add('hide');
        openModal(formMainClass, modalTimerId);

        //создаем блок и присваеваем классы
        const thanksModal = document.createElement('div');
        thanksModal.classList.add(dialogForm);
        thanksModal.innerHTML = `
            <div class="modal__content">                  
                <div data-close class="modal__close">&times;</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector(formMainClass).append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal(formMainClass);
        }, 4000);
    }
}

export default forms;