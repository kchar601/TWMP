const meetingTemplate = document.createElement('template');
meetingTemplate.innerHTML = /*html*/`
    <style>
        :host{
            display: flex;
            flex-direction: column;
            height: fit-content;
            color: white;
            font-family: var(--body-font-type);
            border-radius: 8px;
        }

        .meeting{
            display: flex;
            flex-direction: column;
            padding: 2px 8px;
            border-radius: 8px;
            background: var(--accent-hover);
            justify-content: center;
            text-align: center;
        }

        h4{
            justify-self: center;
            word-wrap: break-word;
            overflow-wrap: break-word;
            font-size: var(--h5-font);
            font-family: var(--head-font-type);
            margin: 0;
            width: 100%;
        }

        .AA{
            background: var(--accent);
        }
        .AA:hover{
            background: var(--accent-hover);
        }

        .OA{
            background: var(--secondary);
        }
        .OA:hover{
            background: var(--secondary-hover);
        }

        .ACOA{
            background: var(--tertiary);
        }
        .ACOA:hover{
            background: var(--tertiary-hover);
        }

        .NA{
            background: var(--fourth-color);
        }
        .NA:hover{
            background: var(--fourth-color-hover);
        }

        .default{
            background: var(--primary);
        }
        .default:hover{
            background: var(--primary-hover);
        }

        .modal-button{
            cursor: pointer;
        }

        .modal {
            position: fixed;
            width: 100vw;
            height: 100vh;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            top: 0;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .open {
            visibility: visible;
            opacity: 1;
            transition-delay: 0s;
        }
        .modal-bg {
            position: absolute;
            background: rgba(0, 0, 0, 0.5);
            width: 100%;
            height: 100%;
        }
        .modal-container {
            border-radius: 10px;
            background: #fff;
            position: relative;
            padding: 30px;
            color: black;
        }
        .modal-close {
            position: absolute;
            right: 15px;
            top: 15px;
            outline: none;
            appearance: none;
            color: red;
            background: none;
            border: 0px;
            font-weight: bold;
            cursor: pointer;
            }
        
        .modal-container h4{
            font-size:var(--h3-font);
        }

        .modal-container span{
            font-size:var(--h5-font);
        }

        .meeting-modal{
            display: flex;
            flex-direction: column;
            padding: 2px 8px;
            border-radius: 8px;
        }
    </style>
    <a class="modal-button" data-modal="modal-one">
    <div class="meeting">
        <h4 class="name"></h4>
        <span class="group"></span>
        <span class="time"></span>
        <span class="location"></span>
        <span class="link"></span>
    </div>
    </a>

    <div class="modal" data-modal-name="modal-one">
    <div class="modal-bg modal-exit"></div>
    <div class="modal-container">
        <div class="meeting-modal">
            <h4 class="modal-name"></h4>
            <span class="modal-group"></span>
            <span class="modal-time"></span>
            <span class="modal-location"></span>
            <span class="modal-link"></span>
        <button class="modal-close modal-exit"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><style>svg{fill:red}</style><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/></svg></button>
    </div>
    </div>
`;

class MeetingDetails extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(meetingTemplate.content.cloneNode(true));
        this._meetingData = null;
        this.boundHandleTriggerClick = this.handleTriggerClick.bind(this);
    }

    setData(meeting) {
        this._meetingData = meeting;
        this._updateDOM();
    }

    connectedCallback() {
        this._updateDOM();
        this.modals = this.shadowRoot.querySelectorAll("[data-modal]");
        this.modals.forEach((trigger) => {
            trigger.addEventListener("click", this.boundHandleTriggerClick);
        });
    }

    _updateDOM() {
        if (this.hasAttribute('name')) {
            var name = this.getAttribute('name');
            var type = this.getAttribute('type');
            this.shadowRoot.querySelector('.name').textContent = name;
            this.shadowRoot.querySelector('.modal-name').textContent = name;
            switch(type){
                case 'AA':
                    this.shadowRoot.querySelector('.meeting').classList.add('AA');
                    break;
                case 'OA':
                    this.shadowRoot.querySelector('.meeting').classList.add('OA');
                    break;
                case 'ACOA':
                    this.shadowRoot.querySelector('.meeting').classList.add('ACOA');
                    break;
                case 'NA':
                    this.shadowRoot.querySelector('.meeting').classList.add('NA');
                    break;
                default:
                    this.shadowRoot.querySelector('.meeting').classList.add('default');
                    break;
            }
        }
        if (this.hasAttribute('group')) {
            this.shadowRoot.querySelector('.group').textContent = this.getAttribute('group');
            this.shadowRoot.querySelector('.modal-group').textContent = this.getAttribute('group');
        }
        if (this.hasAttribute('time')) {
            this.shadowRoot.querySelector('.time').textContent = this.getAttribute('time');
            this.shadowRoot.querySelector('.modal-time').textContent = this.getAttribute('time');
        }
        if (this.hasAttribute('location')) {
            this.shadowRoot.querySelector('.modal-location').textContent = this.getAttribute('location');
        }
        if (this.hasAttribute('link')) {
            this.shadowRoot.querySelector('.modal-link').textContent = this.getAttribute('link');
        }
    }

    disconnectedCallback() {
        this.modals.forEach((trigger) => {
          trigger.removeEventListener("click", this.boundHandleTriggerClick);
        });
      }

    static get observedAttributes() {
        return ['name', 'group', 'time', 'type', 'location', 'link'];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        switch(name) {
            case 'name':
                this.shadowRoot.querySelector('.name').textContent = newVal;
                this.shadowRoot.querySelector('.modal-name').textContent = newVal;
                break;
            case 'group':
                this.shadowRoot.querySelector('.group').textContent = newVal;
                this.shadowRoot.querySelector('.modal-group').textContent = newVal;
                break;
            case 'time':
                this.shadowRoot.querySelector('.time').textContent = newVal;
                this.shadowRoot.querySelector('.modal-time').textContent = newVal;
                break;
            case 'location':
                this.shadowRoot.querySelector('.modal-location').textContent = newVal;
                break;
            case 'link':
                this.shadowRoot.querySelector('.modal-link').textContent = newVal;
                break;
        }
    }

    handleTriggerClick(event) {
        event.preventDefault();
    
        const modal = this.shadowRoot.querySelector('[data-modal-name="modal-one"]');
        modal.classList.add("open");
    
        const exits = modal.querySelectorAll(".modal-exit");
        exits.forEach((exit) => {
          exit.addEventListener("click", this.handleExitClick.bind(this, modal));
        });
      }
    
      handleExitClick(modal, event) {
        event.preventDefault();
        modal.classList.remove("open");
        const exits = modal.querySelectorAll(".modal-exit");
        exits.forEach((exit) => {
          exit.removeEventListener("click", this.handleExitClick.bind(this, modal));
        });
      }
}

window.customElements.define('meeting-details', MeetingDetails);

function addMeetingsToDOM(meetingsArray) {

    const calendarContainer = document.querySelectorAll('.calendar-card');
    calendarContainer.forEach(container => {
        container.innerHTML = '';
        const day = document.createElement('h2');
        const meetingWrapper = document.createElement('div');
        day.textContent = container.id;
        meetingWrapper.classList.add('meeting-Wrapper');
        container.appendChild(day);
        container.appendChild(meetingWrapper);
    });

    meetingsArray.forEach(meeting => {
        var meetingsContainer = document.querySelector('#' + meeting.day + ' > .meeting-Wrapper');
        const meetingElement = document.createElement('meeting-details');
        
        meetingElement.setAttribute('name', meeting.name);
        meetingElement.setAttribute('time', meeting.time);
        meetingElement.setAttribute('type', meeting.type);
        meetingElement.setAttribute('group', meeting.group);
        if (meeting.location != undefined){
            meetingElement.setAttribute('location', meeting.location);
        }
        if (meeting.link != undefined){
            meetingElement.setAttribute('link', meeting.link);
        }
        meetingsContainer.appendChild(meetingElement);
    });
}