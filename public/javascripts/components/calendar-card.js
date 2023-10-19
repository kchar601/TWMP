const calendarCardTemplate = document.createElement('template');
calendarCardTemplate.innerHTML = `
    <style>
        .calendar-card {
            padding: 4px 8px;
            background-color: var(--background-color);
        }

        .first{
            border-bottom-left-radius: 6px;
        }

        .last{
            border-bottom-right-radius: 6px;
        }
    </style>
    <div class="calendar-card">
        <h3 class="day">Monday</h3>
        <span class="meeting-time">6:00-7:00</span>
    </div>
`;

class CalendarCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(calendarCardTemplate.content.cloneNode(true));
    }

    connectedCallback() {
        //implementation
    }

    disconnectedCallback() {
        //implementation
    }

    attributeChangedCallback(name, oldVal, newVal) {
        //implementation
    }

    adoptedCallback() {
        //implementation
    }

}

window.customElements.define('calendar-card', CalendarCard);

function checkSiblings(){
    var select = document.querySelector('tr + calendar-card').shadowRoot.querySelector('.calendar-card').classList.add('first');
    var select = document.querySelector('calendar-card').shadowRoot.querySelector('.calendar-card').classList.add('last');
}

window.addEventListener('load', (event) => {
    checkSiblings();
});