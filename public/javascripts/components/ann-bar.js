const annBar = document.createElement('template');
annBar.innerHTML = /*html*/`
<style>
:host {
    display: flex;
    background-color: #A71D31;
    color: var(--background);
    font-family: 'gabarito', sans-serif;
    font-size: var(--nav-font);
    justify-content: space-between;
    padding: 4px;
    --secondary: #31080c;
    --secondary-hover: #490f15;
  }
  
  #closeAnnouncement {
    background-color: rgb(255, 30, 0);
    border: 1px solid black;
    border-radius: 100%;
    font-size: var(--base-font);
    cursor: pointer;
    align-self: flex-end;
    background-color: var(--secondary-hover);
    margin: auto 16px;
    position: relative;
    width: 32px;
    height: 32px;
  }

  svg{
    position: absolute;
    margin: auto;
    inset: 0;
  }

    #closeAnnouncement:hover, #closeAnnouncement:focus {
    background-color: var(--secondary);
    }

    div {
        padding: 8px;
    }

    .hidden {
        display: none;
    }

</style>
<div>
Attention:
<slot></slot>
</div>
<button id="closeAnnouncement"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><style>svg{fill:#ffffff}</style><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/></svg></button>


`;


class AnnouncementsBar extends HTMLElement {
    constructor(){
        super();
        const shadow = this.attachShadow({mode: 'open'});
        shadow.append(annBar.content.cloneNode(true));
    }

    static get observedAttributes() {
        return ['closed'];
    }

    connectedCallback() {
        this.shadowRoot.querySelector('#closeAnnouncement').addEventListener('click', () => {
            console.log('clicked');
            this.setAttribute('closed', true);
            setAnnouncements();
        })
    }

    attributeChangedCallback(name, oldVal, newVal) {
        console.log(name, oldVal, newVal);
        if (name === 'closed' && newVal === 'true'){
            console.log('closed');
            this.style.display = 'none';
        }
        else if (name === 'closed' && newVal === false){
            console.log('open');
            this.style.display = 'flex';
        }
    }

}

async function setAnnouncements() {
    await fetch('/api/closedAnnouncements');
}

async function getAnnouncements() {
    const body = { page: window.location.pathname };
    const response = await fetch('/api/getAnnouncements', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });
    const data = await response.json();
    if (data[0].closed === false || data[0].closed === undefined){
        document.querySelector('.ann-target').innerHTML = `<ann-bar closed="false"></ann-bar>`;
        document.querySelector('ann-bar').textContent = data[0].message;
    }
}

customElements.define('ann-bar', AnnouncementsBar);

window.addEventListener('DOMContentLoaded', () => {
    getAnnouncements();
})