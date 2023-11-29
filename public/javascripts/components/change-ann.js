const changeAnnTemplate = document.createElement('template');
changeAnnTemplate.innerHTML = /*html*/ `
<style>

</style>

`;

class ChangeAnn extends HTMLElement {
    constructor() {
        super();
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

window.customElements.define('change-ann', ChangeAnn);

//going to be the active announcement which the user can change the info of