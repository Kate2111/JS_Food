window.addEventListener('DOMContentLoaded', () => {
    const calc = require('./modules/calc');
    const cards = require('./modules/cards');
    const forms = require('./modules/forms');
    const modal = require('./modules/modal');
    const slider = require('./modules/slider');
    const tabs = require('./modules/tabs');
    const timer = require('./modules/timer');

    calc();
    cards();
    forms();
    modal();
    slider();
    tabs();
    timer();
});


