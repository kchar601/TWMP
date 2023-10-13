window.onload = function() {
    console.log('hello world');
    getAnnouncements();
}

async function getAnnouncements() {
    console.log('getAnnouncements');
    const response = await fetch('/api/getAnnouncements');
    const data = await response.json();
    console.log(data[0]);
    document.querySelector('ann-bar').innerHTML = data[0].message;
}

