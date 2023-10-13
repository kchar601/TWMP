const footBar = document.createElement('template');
footBar.innerHTML = `
<style>
    :host {
        background-color: var(--secondary);
        display: flex;
        flex-direction: column;
        color: var(--text);
        font-family: 'gabarito', sans-serif;
        font-size: var(--base-font);
        width: 100%;
        padding-bottom: 32px;
    }

    footer {
        display: flex;
        flex-direction: row;
        padding: 0px 64px;
        justify-content: space-evenly;
    }

    .prevent-select {
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    img {
        width: 64px;
        aspect-ratio: 1;
        margin: 8px;
    }

    h2{
        font-size: var(--h2-font);
        margin-left: 8px;
    }

    h3{
        font-size: var(--h3-font);
        margin-bottom: 4px;
    }

    h4{
        font-size: var(--h4-font);
        margin:0px;

    }

    .hero {
        padding: 16px 16px 0 16px;
        display: flex;
        height: fit-content;
    }

    .runOff{
        white-space: wrap;
        max-width: 242px;
    }

    ul {
        list-style-type: none;
        padding: 0;
        gap: 8px;
        margin: 8px;
    }

    li {
        font-size: var(--h5-font);
        border-radius: 8px;
        padding: 8px;

    }

    .hide {
        display: none;
    }

    input {
        border-radius: 8px;
        border: none;
        padding: 8px;
        background-color: var(--background);
        font-size: var(--h4-font);
        font-family: 'gabarito', sans-serif;
    }

    button{
        background-color:var(--accent);
        border: none;
        color: var(--background);
        font-size: var(--h5-font);
        font-family: 'gabarito', sans-serif;
        padding: 8px;
        border-radius: 8px;
    }

    button:hover, button:active, button:focus{
        background-color: var(--hover);
    }

    a {
        display: block;
        text-decoration: none;
        color: var(--text);
        border-radius: 8px;
    }

    a:hover, a:active, a:focus {
        background-color: var(--primary);
        font-weight: bold;
    }

    .special {
        background-color: var(--accent);
        color: var(--background);
    }

    .special:hover, .special:active, .special:focus {
        background-color: var(--hover);
        font-weight: normal;
    }

    .noHover:hover, .noHover:active, .noHover:focus {
        background-color: transparent;
        font-weight: normal;
    }
</style>
<div class="hero">
    <a class="noHover" href='/index.html'><img src="../../images/twmplogo.png"></a>
    <h2 class="prevent-select">The Warrenton Meeting Place</h2>
</div>
<footer>
    <div>
        <h3 class="prevent-select">Site Directory</h3>
        <ul>
            <a href="/index.html"><li>Home</li></a>
            <a href="/meetings.html"><li>Meetings</li></a>
            <a href="/contact.html"><li>Contact</li></a>
            <a href="/about.html"><li>About</li></a>
            <a href="/faq.html"><li>FAQ</li></a>
            <a href="/donate.html" class="special"><li>Donate</li></a>
        </ul>
    </div>
    <div>
        <h3 class="prevent-select">Other Recovery Links</h3>
        <ul>
            <a href="https://www.youtube.com/c/AlcoholicsAnonymousWorldServicesInc"><li class="runOff">Alcoholics Anonymous World Services YouTube Channel</li></a>
            <a href="http://www.aa.org/"><li>Alcoholics Anymous Website</li></a>
        </ul>
    </div>
    <div>
        <h3 class="prevent-select">Admin</h3>
        <ul>
            <a href="/login.html"><li>Login</li></a>
            <a href="/dashboard.html"><li>Dashboard</li></a>
        </ul>
    </div>
    <div>
        <h3 class="prevent-select">Want to stay up to date?</h3>
        <h4 class="prevent-select">Consider subscribing to our mailing list<h4>
        <ul>
            <form>
            
            <li>
                <label for="email" class="hide">Email address:</label>
                <input type="text" placeholder="johnDoe22@gmail.com"></input>
                <button type="submit">Subscribe</button>
            </li>
            </form>
        </ul>
    </div>
</footer>
`;

class FootBar extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});
        shadow.append(footBar.content.cloneNode(true));
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

window.customElements.define('foot-bar', FootBar);