const firebaseConfig = {
  apiKey: "AIzaSyD46ROyTnfXJqlMl1fXxWwTTl7wakSd150",
  authDomain: "contacts-c1616.firebaseapp.com",
  projectId: "contacts-c1616",
  storageBucket: "contacts-c1616.appspot.com",
  messagingSenderId: "847436548282",
  appId: "1:847436548282:web:2aa5897cfdd112c7d81a83",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const contactList = document.getElementById("contactList");

firebase.firestore().enablePersistence()
  .catch((err) => {
      if (err.code == 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
      } else if (err.code == 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
      }
  });

// Subsequent queries will use persistence, if it was enabled successfully
// Function to render a contact in the UI
function renderContact(doc) {
    const data = doc.data();
  
    const listItem = document.createElement("li");
    listItem.classList.add("border", "p-4", "rounded-md", "shadow-sm");
  
    listItem.innerHTML = `
      <p class="font-medium">${data.name}</p>
      <p class="text-gray-600 py-1">${data.number}</p>
      <button class="deleteButton px-2 py-1 bg-purple-500 text-white rounded-md">Delete</button>
    `;
  
    // Attach a click event listener to the delete button
    const deleteButton = listItem.querySelector(".deleteButton");
    deleteButton.addEventListener("click", () => {
      deleteContact(doc.id); // Call deleteContact function with the document ID
    });
  
    contactList.appendChild(listItem);
  }
  

// Real-time listener for contact data changes
db.collection("contacts").onSnapshot((snapshot) => {
  contactList.innerHTML = ""; // Clear previous data

  snapshot.forEach((doc) => {
    renderContact(doc);
  });
});

// Add new contact without refreshing the page
const saveButton = document.getElementById("saveButton");
const nameInput = document.getElementById("name");
const numberInput = document.getElementById("number");

saveButton.addEventListener("click", function () {
  const name = nameInput.value;
  const number = numberInput.value;

  if (name && number) {
    db.collection("contacts")
      .add({
        name,
        number,
      })
      .then(() => {
        console.log("Contact added successfully!");
      })
      .catch((error) => {
        console.error("Error adding contact: ", error);
      });

    nameInput.value = "";
    numberInput.value = "";
  }
});

function deleteContact(docId) {
    db.collection("contacts")
      .doc(docId)
      .delete()
      .then(() => {
        console.log("Contact deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting contact: ", error);
      });
  }
  