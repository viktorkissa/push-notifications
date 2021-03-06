self.addEventListener('notificationclick', function (e) {
    var notification = e.notification;
    var action = e.action;

    console.log('notification', notification);
    console.log('action', action);

    if(action === 'confirm') {
        console.log('Confirm was chosen');
        notification.close();
    } else {
        e.waitUntil(
            clients.matchAll().then(function (clis) {
                var client = clis.find(function (c) {
                    return c.visibilityState === 'visible'; // our browser is open
                });

                if(client !== undefined) {
                    client.navigate('http://localhost:3001');
                    client.focus();
                } else {
                    clients.openWindow('http://localhost:3001')
                }
                console.log('Action was not confirmed',action);
                notification.close();
            })
        );
    }
});

self.addEventListener('notificationclose', function (e) {
    console.log('Notification was closed', e);
});

self.addEventListener('push', function (e) {
   console.log('Push Notification Recieved', e);
   var data = {title: 'Default Title', content: 'Default Content!!!'};
   if(e.data) {
        data = JSON.parse(e.data.text());
   }

   var options = {
       body: data.content,
       icon: '/app-icon-96x96.png',
       image: '/sf-boat.jpg',
       dir: 'ltr',
       lang: 'en-US',
       vibrate: [100, 50, 200],
       badge: '/app-icon-96x96.png',
       tag: 'confirm-notification',
       renotify: true,
       actions: [
           {action: 'confirm', title: 'Okay', icon: '/app-icon-96x96.png'},
           {action: 'cancel', title: 'Cancel', icon: '/app-icon-96x96.png'}
       ]
   };

   e.waitUntil(
       self.registration.showNotification(data.title, options)
   );
});