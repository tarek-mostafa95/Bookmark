"use strict";

let addSitesForm = document.querySelector("#addSitesForm");
let siteNameInput = document.querySelector("#siteName");
let siteUrlInput = document.querySelector("#siteUrl");
let siteWrapper = document.querySelector(".sites-wrapper");
let sites = JSON.parse(localStorage.getItem("sites")) || [];
let visitBtn = document.querySelector(".visit-btn");
let deletBtn = document.querySelector(".delete-btn");


addSitesForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!validateUserInput(siteNameInput) && !validateUserInput(siteUrlInput)) {
    e.stopPropagation();

    Swal.fire({
      icon: "error",
      text: "Please Enter a Valid Data!",
    });

    return;
  }

  //check if exist in the array
  let isSiteExist = checkIsSiteExist();
  if (isSiteExist) {
    Swal.fire({
      icon: "error",
      text: "This Site Is Already Added To Your List!",
    });
  } else {
    addNewSite();
    Swal.fire({
      icon: "success",
      text: "This Site  Added To Your List!",
    });
  }

  //Re display all sites
  displaySites();

  //reset form inputs
  resetValidationClassesAndForm();
});

function validateUserInput(input) {
  let regex = {
    siteName: /^[A-Z][a-zA-Z]{2,}$/,
    siteUrl: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-]*)*$/,
  };

  var isValid = regex[input.id].test(input.value);

  if (isValid) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    input.nextElementSibling.classList.add("d-none");
    input.nextElementSibling.classList.remove("d-inline");
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    input.nextElementSibling.classList.remove("d-none");
    input.nextElementSibling.classList.add("d-inline");
  }
  return isValid;
}

function addNewSite() {
  // Add the new site to the array
  const newSite = {
    siteName: siteNameInput.value,
    siteUrl: siteUrlInput.value,
  };
  sites.push(newSite);

  // Save the updated array to localStorage
  saveSitesToLocalStorage();
}
displaySites();

function displaySites() {
  var wrapper = "";
  for (let i = 0; i < sites.length; i++) {
    wrapper += `
      
        <tr>
            <td>${i + 1}</td>
            <td>${sites[i].siteName}</td>
            <td><a href="${sites[i].siteUrl}" target="_blank"  class="btn visit-btn fs-6"><i class="fa-solid fa-eye"></i> Visit</a></td>
            <td><button onclick="deleteSite(${i})" class="btn delete-btn fs-6"><i class="fa-solid fa-trash-can"></i> Delete</button></td>
        </tr>
    `;
  }
  siteWrapper.innerHTML = wrapper;
}

function saveSitesToLocalStorage() {
  localStorage.setItem("sites", JSON.stringify(sites));
}

function checkIsSiteExist() {
  let siteNameValue = siteNameInput.value;
  let siteUrlValue = siteUrlInput.value;

  if (sites.length === 0) {
    return false;
  } else {
    // Check for duplicates
    let isDuplicate = sites.some(
      (site) =>
        site.siteName.toLowerCase() === siteNameValue.toLowerCase() ||
        site.siteUrl.toLowerCase() === siteUrlValue.toLowerCase()
    );

    return isDuplicate;
  }
}

function resetValidationClassesAndForm() {
  addSitesForm.reset();
  siteNameInput.classList.remove("is-valid", "is-invalid");
  siteUrlInput.classList.remove("is-valid", "is-invalid");
}

function deleteSite(index) {
  // Remove the site at the specified index
  sites.splice(index, 1);

  // Save the updated array to localStorage
  saveSitesToLocalStorage();

  //display user msg
  Swal.fire({
    icon: "success",
    text: "Site Deleted Successfully",
  });

  // Re-render the site list
  displaySites();
}
