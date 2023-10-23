const meetingTemplate = document.createElement('template');
meetingTemplate.innerHTML = /*html*/`
    <style>
        :host{
            display: flex;
            flex-direction: column;
            width: 100%;
            height: fit-content;
            background-color: black;
            color: white;
            font-family: 'gabarito', sans-serif;
        }
    </style>
    <div class="meeting">
        <h4 class="name"></h4>
        <p class="group"></p>
        <p class="time"></p>
        <p class="location"></p>
        <p class="link"></p>
    </div>
`;

class MeetingDetails extends HTMLElement {
    // ... previous code ...

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
        if (this._meetingData) {
            this._updateDOM();
        }
    }

    _updateDOM() {
        if (this.hasAttribute('name')) {
            this.shadowRoot.querySelector('h4').textContent = this.getAttribute('name');
        }
        if (this.hasAttribute('group')) {
            this.shadowRoot.querySelector('.group').textContent = this.getAttribute('group');
        }
        if (this.hasAttribute('time')) {
            this.shadowRoot.querySelector('.time').textContent = this.getAttribute('time');
        }
        if (this.hasAttribute('location')) {
            this.shadowRoot.querySelector('.location').textContent = this.getAttribute('location');
        }
        // if (this.getAttribute('location') === "undefined"){
        //     this.shadowRoot.querySelector('.location').style.display = "none";
        // }
        if (this.hasAttribute('link')) {
            this.shadowRoot.querySelector('.link').textContent = this.getAttribute('link');
        }
        // if (this.getAttribute('link') === "undefined"){
        //     this.shadowRoot.querySelector('.link').style.display = "none";
        // }
    }



    static get observedAttributes() {
        return ['bgColor', 'textColor', 'name', 'group', 'time', 'location', 'link'];
    }

    connectedCallback() {
        this._updateDOM();
    }

    disconnectedCallback() {
        //implementation
    }

    attributeChangedCallback(name, oldVal, newVal) {
        switch(name) {
            case 'name':
                this.shadowRoot.querySelector('h4').textContent = newVal;
                break;
            case 'group':
                this.shadowRoot.querySelector('.group').textContent = newVal;
                break;
            case 'time':
                this.shadowRoot.querySelector('.time').textContent = newVal;
                break;
            case 'location':
                this.shadowRoot.querySelector('.location').textContent = newVal;
                break;
            case 'link':
                this.shadowRoot.querySelector('.link').textContent = newVal;
                break;
        }
    }

    adoptedCallback() {
        //implementation
    }

}

window.customElements.define('meeting-details', MeetingDetails);

function addMeetingsToDOM(meetingsArray) {

    //Clear old meetings
    const calendarContainer = document.querySelectorAll('.calendar-card');
    calendarContainer.forEach(container => {
        container.innerHTML = '';
        //insert name of day based on switch
        const day = document.createElement('h2');
        day.textContent = container.id;
        container.appendChild(day);
    });

    meetingsArray.forEach(meeting => {
        var meetingsContainer = document.getElementById(meeting.day);
        const meetingElement = document.createElement('meeting-details');
        
        // Set attributes
        meetingElement.setAttribute('name', meeting.name);
        meetingElement.setAttribute('time', meeting.time);
        if (meeting.group != undefined){
            meetingElement.setAttribute('group', meeting.group);
        }
        if (meeting.location != undefined){
            meetingElement.setAttribute('location', meeting.location);
        }
        if (meeting.link != undefined){
            meetingElement.setAttribute('link', meeting.link);
        }
        
        // Append to the container
        meetingsContainer.appendChild(meetingElement);
    });
}