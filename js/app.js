const publicKey = 'BFtX42XNx31EmwuVegKXPhX6bW8AiVOEACYRmB6Lz1-uAAee7IIF5YXX8e7U4fNzYe6x2GNkP8YYPq9sdyXVu10';

if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.register('service-worker.js')
        .then((registration) => {
            console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
            console.error('Service Worker registration failed:', error);
        });
}

document.addEventListener('DOMContentLoaded', async () => {
    const registration = await navigator.serviceWorker.ready;

    // Request notification permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
        alert('Notification permission denied');
        return;
    }

    // Subscribe to push notifications
    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
    });

    // Send subscription to server
    await fetch('https://notify-zb20.onrender.com/subscribe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
    });
});


function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}
