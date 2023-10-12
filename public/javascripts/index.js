window.onload = function() {
    console.log('hello world');
    getAnnouncements();
}

async function getAnnouncements() {
    console.log('getAnnouncements');
    const response = await fetch('/api/getAnnouncements');
    const data = await response.json();
    console.log(data);
    return data;
}