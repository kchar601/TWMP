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
            font-family: var(--head-font-type);
            font-size: var(--h4-font);
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
            align-self: center;
        }

        select{
            font-size: var(--body-font);
            padding:4px;
            border-radius: 4px;
            font-family: var(--body-font-type);
        }
        label {
            width: fit-content;
            font-size: var(--h5-font);
        }
    </style>
    <div class="tab-row">
    <button class="tab tab-active tab-first" id="in-person">In-person</button>
    <button class="tab" id="online">Online</button>
    </div>
    <div class="filter">
    <label for="open">Open:</label>
    <input type="checkbox" id="open" name="open" value="open" onchange="handleSelection()">
    <label for="day">Group:</label>
    <select name="group" id="day" onchange="handleSelection()">
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
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(tabBarTemplate.content.cloneNode(true));
        this.setAttribute('medium', 'in-person');
        filterSelect('none', '', ''); 
    }

    static get observedAttributes() {
        return ['medium'];
    }

    set medium(val) {
        this.setAttribute('medium', val);
    }

    connectedCallback() {
        this.shadowRoot.getElementById('in-person').addEventListener('click', () => {
            tabSelect('in-person');
        });
    
        this.shadowRoot.getElementById('online').addEventListener('click', () => {
            tabSelect('online');
        });
    }    

    attributeChangedCallback(name, oldVal, newVal) {
        if(name === 'medium'){
            var tabs = this.shadowRoot.querySelectorAll('.tab');
            tabs.forEach(tab => {
                tab.classList.remove('tab-active');
            });
            var active = this.shadowRoot.querySelector("#" + newVal);
            active.classList.add('tab-active');
            handleSelection();
        }
    }
}

window.customElements.define('tab-bar', TabBar);

function handleSelection() {
    var day = document.querySelector('tab-bar').shadowRoot.getElementById('day').value;
    var open = document.querySelector('tab-bar').shadowRoot.getElementById('open').checked;
    console.log("Day selected:", day);
    console.log("Open selected:", open);
    if (day === 'all') {
        day = '';
    }
    if(document.querySelector('tab-bar').shadowRoot.getElementById('open').checked){
        filterSelect('both', day, true);
    }
    else {
        filterSelect('type', day, '');
    }
}    

async function filterSelect(filter, value, openVal){
    const mediumVal = document.querySelector('tab-bar').getAttribute('medium');
    console.log(mediumVal);
    console.log("Filtering by:", filter, value, openVal, mediumVal);
    switch(filter){
        case "type":
            var input = {
                type: value,
                medium: mediumVal
            };
            break;
        case "open":
            var input = {
                open: value,
                medium: mediumVal
            };
            break;
        case "both":
            var input = {
                type: value,
                open: openVal,
                medium: mediumVal
            };
            break;
        default:
            var input = {
                medium: mediumVal
            };
            break;
    }
    console.log(input);
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