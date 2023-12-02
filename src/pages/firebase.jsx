// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDELo1QUTsebCf81nq_ngR1qbYvnGY3FpA",
    authDomain: "pushnotification-e6beb.firebaseapp.com",
    projectId: "pushnotification-e6beb",
    storageBucket: "pushnotification-e6beb.appspot.com",
    messagingSenderId: "703751394840",
    appId: "1:703751394840:web:de07bf2946586b402d556d"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Instantiate Messaging
const messaging = getMessaging(app);

export const requestPermission = () => {
    console.log("Requesting user permission");
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            console.log("Notification user permission granted");
            return getToken(messaging, {
                vapidKey: "BKdi7Y8_wITJDX0ZhauAzz4-wQxj33I_N_F6Kjsifl9IMabs73JY427gb-wuMkhjTzyQYSBypji0pO0ep4JkH64"
            })
            .then(currentToken => {
                if (currentToken) {
                    console.log("client token", currentToken);
                } else {
                    console.log("Failed to generate token");
                }
            }).catch(err => {
                console.log("Error occurred when requesting to receive token", err);
            });
        } else {
            console.log("Permission denied");
        }
    });
};
requestPermission()

export const onMessageListener = () => {
    return new Promise(resolve => {
        onMessage(messaging, payload => {
            resolve(payload);
        });
    });
};
