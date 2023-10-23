const tabBarTemplate = document.createElement('template');
tabBarTemplate.innerHTML = /*html*/`
    <style>
        :host{
            display: flex;
            flex-direction: row;
            height: 100%;
            width: 100%;
            border-bottom: var(--accent) 2px solid;
            justify-content: space-between;
        }

        .tab-row{
            display:flex;
        }

        .tab{
            font: var(--font-style);
            font-size: var(--button-font);
            padding: 12px 16px;
            border: none;
            background-color: var(--background);
        }

        .tab:hover{
            background-color: var(--background-hover);
        }

        .tab-first{
            border-top-left-radius: 6px;
        }

        .tab-active{
            background-color: var(--accent);
            color: var(--background);
        }

        .tab-active:hover{
            background-color: var(--accent-hover);
        }

        .filter{
            padding:8px;
        }

        select{
            font-size: var(--base-font);
            padding:4px;
        }
    </style>
    <div class="tab-row">
    <button class="tab tab-active tab-first" id="in-person">In-person</button>
    <button class="tab" id="online">Online</button>
    </div>
    <div class="filter">
    <select name="group" id="day" onchange="handleSelection('day')">
        <option value="all">All</option>
        <option value="AA">AA</option>
        <option value="OA">OA</option>
        <option value="ACOA">ACOA</option>
    </select>
    <div>
`;

class TabBar extends HTMLElement {
    constructor() {
        super();
        this.medium = 'in-person';
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(tabBarTemplate.content.cloneNode(true));
        filterSelect('');        
    }

    static get observedAttributes() {
        return ['medium'];
    }

    connectedCallback() {
        this.shadowRoot.getElementById('in-person').addEventListener('click', () => {
            tabSelect('in-person');
        });
    
        this.shadowRoot.getElementById('online').addEventListener('click', () => {
            tabSelect('online');
        });
    }    

    disconnectedCallback() {
        //implementation
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if(name === 'medium'){
            var tabs = this.shadowRoot.querySelectorAll('.tab');
            tabs.forEach(tab => {
                tab.classList.remove('tab-active');
            });
            var active = this.shadowRoot.querySelector("#" + newVal);
            active.classList.add('tab-active');
        }
    }

    adoptedCallback() {
        //implementation
    }
}

window.customElements.define('tab-bar', TabBar);

function handleSelection() {
    const select = document.querySelector('tab-bar').shadowRoot.getElementById('day');
    const selectedValue = select.value;
    groupSelect(selectedValue);
}    

function groupSelect(selectedValue) {
    switch(selectedValue) {
        case "all":
            filterSelect('');
            break;
        case "AA":
            filterSelect('AA');
            break;
        case "OA":
            filterSelect('OA');
            break;
        case "ACOA":
            filterSelect('ACOA');
            break;
    }
}

async function filterSelect(value){
    console.log(value);
    const mediumVal = document.querySelector('tab-bar').getAttribute('medium');
    const input = {
        type: value,
        medium: mediumVal
    };
    const response = await fetch('/api/filterMeetings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(input)
    });
    const data = await response.json();
    console.log(data);
    addMeetingsToDOM(data);
}

function tabSelect(name){
    console.log("Medium selected:", name);
    document.querySelector('tab-bar').setAttribute('medium', name);
}