importScripts("https://www.gstatic.com/firebasejs/8.1.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.1.1/firebase.js");
importScripts("https://www.gstatic.com/firebasejs/8.1.1/firebase-messaging.js");


 // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyDsTL_n-QfmV48cGDbaCK_zjSbVEI9XEzA",
    authDomain: "vrcommerce-dee8f.firebaseapp.com",
    databaseURL: "https://vrcommerce-dee8f.firebaseio.com",
    projectId: "vrcommerce-dee8f",
    storageBucket: "vrcommerce-dee8f.appspot.com",
    messagingSenderId: "286274690055",
    appId: "1:286274690055:web:1132bc4d6c82f7da91dea2",
    measurementId: "G-BPRMG2JJKC"
  };


//   // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  messaging.onBackgroundMessage(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
      body: 'Background Message body.',
      icon: '/firebase-logo.png'
    };
    return self.registration.showNotification(notificationTitle,
      notificationOptions);
  });

  const messaging = firebase.messaging() ;
