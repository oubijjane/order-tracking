import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB1N5OdatYHItz69dAzjVC8HjJsX-S3f5I",
  authDomain: "verauto-order-tracking.firebaseapp.com",
  projectId: "verauto-order-tracking",
  messagingSenderId: "143564317747",
  appId: "1:143564317747:web:d781bd7f2045b972c8ef46"
};

export const app = initializeApp(firebaseConfig);