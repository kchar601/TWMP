
var activeID;

const meetingTemplate = document.createElement('template');
meetingTemplate.innerHTML = /*html*/`
    <style>
        :host{
            display: flex;
            flex-direction: column;
            height: 100%;
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

        @media (max-width: 1273px) AND (min-width: 0px) {
            .meeting{
                width: 100%;
                justify-content: center;
            }
            .modal-button{
                align-self: center;
                width: 60%;
            }
        }

        .prevent-select {
            -webkit-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }
    </style>
    <a class="modal-button" data-modal="modal">
    <div class="meeting">
        <h4 class="name"></h4>
        <span class="group"></span>
        <span class="time"></span>
    </div>
    </a>
`;

class MeetingDetails extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(meetingTemplate.content.cloneNode(true));
        this._meetingData = null;
    }

    setData(meeting) {
        this._meetingData = meeting;
        this._updateDOM();
    }

    connectedCallback() {
        this._updateDOM();
    }

    _updateDOM() {
        if (this.hasAttribute('name')) {
            var name = this.getAttribute('name');
            var type = this.getAttribute('type');
            this.shadowRoot.querySelector('.name').textContent = name;
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
        }
        if (this.hasAttribute('time')) {
            this.shadowRoot.querySelector('.time').textContent = this.getAttribute('time');
        }
        if(this.hasAttribute('open')){
            console.log(this.getAttribute('open'));
        }
    }

    static get observedAttributes() {
        return ['name', 'group', 'time', 'type', 'location', 'link', 'open'];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        switch(name) {
            case 'name':
                this.shadowRoot.querySelector('.name').textContent = newVal;
                break;
            case 'group':
                this.shadowRoot.querySelector('.group').textContent = newVal;
                break;
            case 'time':
                this.shadowRoot.querySelector('.time').textContent = newVal;
                break;
        }
    }
}

window.customElements.define('meeting-details', MeetingDetails);

async function addMeetingsToDOM(meetingsArray) {

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

    await meetingsArray.forEach(meeting => {
        var meetingsContainer = document.querySelector('#' + meeting.day + ' > .meeting-Wrapper');
        const meetingElement = document.createElement('meeting-details');
        
        meetingElement.setAttribute('_id', meeting._id);
        meetingElement.setAttribute('name', meeting.name);
        meetingElement.setAttribute('time', meeting.time);
        meetingElement.setAttribute('type', meeting.type);
        meetingElement.setAttribute('group', meeting.group);
        meetingElement.setAttribute('open', meeting.open);
        if (meeting.location != undefined){
            meetingElement.setAttribute('location', meeting.location);
        }
        if (meeting.link != undefined){
            meetingElement.setAttribute('link', meeting.link);
        }
        meetingsContainer.appendChild(meetingElement);
    });

    document.querySelectorAll('meeting-details').forEach(meeting => {
        meeting.addEventListener('click', function(event) {
            const meetingElement = event.currentTarget;
            console.log(meetingElement);
            const link = meetingElement.getAttribute('link');

            
    
            document.querySelector('.modal').classList.add("open");
            console.log(document.querySelector('.modal'));
            document.getElementById('meeting-name').value = meetingElement.getAttribute('name');
            document.getElementById('meeting-group').value = meetingElement.getAttribute('group');
            document.getElementById('meeting-time').value = meetingElement.getAttribute('time');
            document.getElementById('meeting-location').value = meetingElement.getAttribute('location');
    
            link ? document.getElementById('.meeting-link').value = link : document.getElementById('meeting-link').value = '';
    
            meetingElement.getAttribute('open') !== 'false' ? document.getElementById('meeting-open').checked = true : document.getElementById('meeting-open').checked = false;
        });
    });    
    document.getElementById('modalClose').addEventListener('click', () => {
        document.querySelector('.modal').classList.remove("open");
    });
    hideLoader();
}