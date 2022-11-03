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