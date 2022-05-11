const apiKey = "AIzaSyDwFz89HsDDFl_dGv9Y04Hi41jBGrli2ak";

const userInput = document.querySelector(".user-input");
const userBtn = document.querySelector(".user-btn");
const inputForm = document.querySelector(".input-form")
inputForm.addEventListener("submit", (e) => {
  e.preventDefault()
  const userValue = userInput.value;
  const urlEncodedUserValue = encodeURIComponent(userValue)
  location.href="./activities.html?location=" + urlEncodedUserValue
  });