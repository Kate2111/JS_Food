

const postData = async (url, data) => {
    const res = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: data
    });

    return await res.json();
};


/* async function getResource() {
    const res = await fetch('https://my-project-53597-default-rtdb.asia-southeast1.firebasedatabase.app/menu');

    if (!res.ok) {
        throw new Error(`Could not fetch ${'https://my-project-53597-default-rtdb.asia-southeast1.firebasedatabase.app/menu'}, status: ${res.status}`);
    }

    return await res.json();
} */


import { initializeApp } from "firebase/app";
import { getDatabase, get, set, remove, ref, child } from "firebase/database";

 const firebaseConfig = {
   apiKey: "AIzaSyA9knLZoLZlpSkvNQR6BSW6xOLzlHzkqYM",
   authDomain: "my-project-53597.firebaseapp.com",
   databaseURL: "https://my-project-53597-default-rtdb.asia-southeast1.firebasedatabase.app/",
   projectId: "my-project-53597",
   storageBucket: "my-project-53597.appspot.com",
   messagingSenderId: "245011783044",
   appId: "1:245011783044:web:566d98f7ef6124648491d1",
   measurementId: "G-6DQ3FMN5PG"
 };



 const firebaseApp = initializeApp(firebaseConfig);
 const db = getDatabase();

 function getResource(recourse) {
  const recourseRef = ref(db, recourse);
  return new Promise((resolve, reject) => {
    get(recourseRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const recourseValue = snapshot.val();
          console.log(recourseValue);
          resolve(recourseValue);
        } else {
          console.log("Данные отсутствуют");
          resolve(null);
        }
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
}


export {postData};
export {getResource};

