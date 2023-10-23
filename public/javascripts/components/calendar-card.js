import { MeetingDetails } from './meeting-details.js';

const calendarCardTemplate = document.createElement('template');
calendarCardTemplate.innerHTML = /*html*/`
    <style>
        :host{

        }

        .calendar-card {
            
        }




    </style>
    <div class="calendar-card">
        <h2></h2>
    </div>
`;

class CalendarCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(calendarCardTemplate.content.cloneNode(true));
    }

    static get observedAttributes() {
        return ['day', 'order', 'meetings'];
    }

    connectedCallback() {
        this.day = this.getAttribute('day') || 'Day';
        this.shadowRoot.querySelector('h2').textContent += this.day;
        if (this.getAttribute('order') === "first") {
            this.shadowRoot.querySelector('.calendar-card').classList.add("first");
        }
        else if (this.order === "last") {
            this.shadowRoot.querySelector(':host').style.borderRadius = "0 0 6px 0";
            this.shadowRoot.querySelector('.calendar-card').style.border = "none";
        }
    }

    disconnectedCallback() {
        //implementation
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (name === 'meetings') {
            const meetingsContainer = this.shadowRoot.querySelector('.calendar-card');
            
            // Let's create a container for the meetings
            let meetingHolder = this.shadowRoot.querySelector('.meetings-container');
            if (!meetingHolder) {
                meetingHolder = document.createElement('div');
                meetingHolder.className = 'meetings-container';
                meetingsContainer.appendChild(meetingHolder);
            }
            
            // Clear old meetings
            while (meetingHolder.firstChild) {
                meetingHolder.removeChild(meetingHolder.firstChild);
            }

            const meetings = JSON.parse(newVal);
            meetings.forEach(meeting => {
                const meetingDetails = document.createElement('meeting-details');
                meetingDetails.setAttribute('title', meeting.title);
                meetingDetails.setAttribute('group', meeting.group);
                meetingDetails.setAttribute('time', meeting.time);
                meetingDetails.setAttribute('location', meeting.location);
                meetingDetails.setAttribute('link', meeting.link);
                meetingHolder.appendChild(meetingDetails);
            });
        }
    }

    adoptedCallback() {
        //implementation
    }

    // Inside the calendar-card component or related logic
    set meetings(meetingsArray) {
        // Clear old meetings
        this.innerHTML = ''; 
    
        // Append new meetings
        meetingsArray.forEach(meeting => {
            const meetingElement = document.createElement('meeting-details');
    
            setTimeout(() => {
                meetingElement.setAttribute('title', meeting.title);
                meetingElement.setAttribute('group', meeting.group);
                meetingElement.setAttribute('time', meeting.time);
                // ... set other attributes
    
                this.appendChild(meetingElement);
            }, 0);
        });
    }
    

get meetings() {
    return this._meetings;
}

}

window.customElements.define('calendar-card', CalendarCard);

function addElement(element) {
    const calendar = document.querySelector('calendar');
    calendar.appendChild(element);
}

window.addEventListener('load', (event) => {

});