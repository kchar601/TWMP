const loginTemplate = document.createElement('template');
loginTemplate.innerHTML = /*html*/`
    <style>
        :host {
            display: flex;
            flex-direction: column;
            color: var(--text-color);
            background-color: var(--background-hover);
            font-family: 'gabarito', sans-serif;
            width:100%;
            border-radius: inherit;
        }

        .main-heading {
            font-size: var(--h2-font);
            font-weight: bold;
            padding: 16px;
            text-align: center;
            margin-bottom: 0px;
        }

        .form {
            display: flex;
            flex-direction: column;
            max-width: 40%;
            margin: auto;
            padding-bottom: 64px;
        }

        label {
            display: flex;
            width: fit-content;
            padding: 8px 0px;
            font-size: var(--h5-font);
        }

        button {
            width: fit-content;
            background-color: var(--accent);
            color: var(--background);
            border: none;
            border-radius: 8px;
            padding: 16px;
            margin: auto;
            font-size: var(--h5-font);
            margin-top: 32px;
        }

        button:hover {
            cursor: pointer;
            background-color: var(--accent-hover);
        }

        input {
            border: 2px solid var(--secondary);
            border-radius: 8px;
            padding: 8px;
            margin: 8px 0px;
            font-size: var(--body-font);
        }

        .error {
            border: 3px solid red;
        }

        span {
            margin-left: 8px;
            padding: 8px;
            margin: 8px 0px;
            font-size: var(--body-font);
        }
    </style>
<div class="container">
        <h2 class="main-heading">Sign in to TWMP</h2>
        <div class="form">
            <label for="user">Username</label>
            <input  id="user" placeholder="Enter username"/>
            <label for="pass">Password</label>
            <input type="password" id="pass" placeholder="Enter password"/>
            <div>
            <input type="checkbox" onclick="showPassword()"><span>Show Password</span>
            </div>
            <button onclick="return checkLogin()">Sign in</button>
        </div>
</div>
`;

class LoginModal extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});
        var template = loginTemplate.content.cloneNode(true);
        shadow.append(template);
    }
}

window.customElements.define('login-modal', LoginModal);

var selectShadow = document.querySelector('login-modal').shadowRoot;

function showPassword() {
    var x = selectShadow.querySelector('#pass');
    console.log(x);
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }

function checkLogin(){
    const user = selectShadow.querySelector('#user').value;
    const pswd = selectShadow.querySelector('#pass').value;
    console.log(user + " " + pswd);
    if(user == ""){
        alert("Please enter a valid username"); 
        return false;
    };
    if(pswd == ""){
        alert("Please enter a valid password"); 
        return false;
    }
    const data = {username: user, password: pswd};
    console.log(data);
    return checkUser(data);

}

async function checkUser(send){
    console.log(send);
    const response = await fetch('/api/checkLogin', {
        method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(send)
  });
    const data = await response.json();
    console.log(data);
    if(data[0]){
        window.location = "index.html";
        return true;
    }
    else{
        alert("Username and password combination does not exist");
        selectShadow.querySelector('#pass').value = "";
        return false;
        };
}

//TODO: redirect if already logged in