function checkMsg(){
    showLoader();
    const name = document.querySelector('#nameInput').value;
    const email = document.querySelector('#emailInput').value;
    const msg = document.querySelector('#msgInput').value;
    const emailList = document.querySelector('#emailList').checked;
    if(name == ""){
        hideLoader();
        alert("Please enter a valid name"); 
        return false;
    };
    if(email == "" || !email.includes("@")){
        hideLoader();
        alert("Please enter a valid email"); 
        return false;
    }
    if(msg == ""){
        hideLoader();
        alert("Please enter a valid message"); 
        return false;
    }
    const data = {name: name, email: email, msg: msg};
    console.log(data);
    emailList ? addEmail() : console.log("Not adding email");
    return sendMsg(data);
}

async function sendMsg(data){
    const response = await fetch('/api/sendMsg', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log(result);
    if(result.status == "success"){
        hideLoader();
        alert("Message sent successfully");
    }
    else{
        hideLoader();
        alert("Message failed to send");
    }
}

async function addEmail(){
    const body = {email: email};
    const response = await fetch('/api/addEmail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });
    const result = await response.json();
    console.log(result);
}