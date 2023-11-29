const connectBarTemplate = document.createElement('template');
connectBarTemplate.innerHTML = /*html*/`
<style>
    :host {
        background-color: var(--accent);
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: var(--background);
        font-family: 'gabarito', sans-serif;
        font-size: var(--nav-font);
        padding: 8px;
        
    }
    div {
        display: flex;
        align-items: center;
        margin-left: 16px;
    }

    .seamless {
        margin-top: auto;
        text-decoration: none;
        color: var(--background);
        border-radius: 8px;
        background-color: transparent;
        border: none;
    }

    a:hover, a:active, a:focus {
        background-color: var(--accent-hover);
        cursor: pointer;
    }

    a{
        display: flex;
        padding: 8px 12px;
        border-radius: 8px;
    }

    span {
        justify-content: flex-end;
        align-self: flex-end;
        margin-right: 16px;
    }

    @media only screen and (max-width: 768px) {
        span {
            margin-right: 8px;
        }
    }

</style>
<div>
    Get connected with us!
</div>
<span>
    <button class="seamless">
        <a href="mailto:thewarrentonmtgplace@gmail.com" target="_blank">
        <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 512 512"><style>svg{fill:#ffffff}</style><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/></svg>
        </a>
    </button>
    <button class="seamless">
    <a href="https://www.facebook.com/groups/533340580924988" target="_blank">
    <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 512 512"><style>svg{fill:#ffffff}</style><path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"/></svg>
    </a>
    </button>
</span>
`;

class connectBar extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});
        shadow.append(connectBarTemplate.content.cloneNode(true));
    }
}

window.customElements.define('connect-bar', connectBar);