const navBar = document.createElement('template');
navBar.innerHTML = `
<style>
    :host {
        display: flex;
        background-color: var(--secondary);
        color: var(--text);
        font-family: 'gabarito', sans-serif;
        font-size: var(--nav-font);
    }

    nav {
        margin-left:8px;
        width: 100%;
        display: flex;
    }

    ul {
        display: flex;
        list-style-type: none;
        width: 100%;
        padding: 0;
        gap: 8px;
        margin: 8px;
    }

    li, button {
        padding: 16px;
        border-radius: 8px;
    }

    li{
        position: relative;
    }

    a {
        margin-top: auto;
        margin-bottom: auto;
        text-decoration: none;
        color: var(--text);
        border-radius: 8px;
    }

    .mainNav:hover, .mainNav:active, .mainNav:focus {
        background-color: var(--primary);
        font-weight: bold;
        animation: moving 5s infinite;
        -webkit-animation: moving .5s ease-in-out infinite alternate;
    }

    @keyframes moving {
        from {transform: translateY(0px);}
        to {transform: translateY(-4px);}
    }

    img {
        width: 64px;
        aspect-ratio: 1;
        margin: 8px;
        padding-left: 8px;
    }

    button{
        background-color:var(--accent);
        border: none;
        color: var(--background);
        font-size: var(--h5-font);
        font-family: 'gabarito', sans-serif;
    }

    button:hover, button:active, button:focus{
        background-color: var(--hover);
        animation: moving 5s infinite;
        -webkit-animation: moving .5s ease-in-out infinite alternate;
    }

    .donate{
        margin-right: 16px;
    }
</style>
<nav>
    <a href='/index.html'><img src="../../images/twmplogo.png"></a>
    <ul>
        <a class="mainNav" href='/index.html'><li>Home</li></a>
        <a class="mainNav" href='/meetings.html'><li>Meetings</li></a>
        <a class="mainNav" href='/contact.html'><li>Contact</li></a>
        <a class="mainNav" href='/about.html'><li>About</li></a>
        <a class="mainNav" href='/faq.html'><li>FAQ</li></a>
    </ul>
    <a class="donate"><button>Donate</button></a>
</nav>
`;

class NavBar extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});
        shadow.append(navBar.content.cloneNode(true));

    }

    connectedCallback() {

    }

}

window.customElements.define('nav-bar', NavBar);