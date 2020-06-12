//get elements
const itemList = document.querySelector(".items");
const httpForm = document.getElementById("httpForm");
const itemInput = document.getElementById("itemInput");
const imageInput = document.getElementById("imageInput");
const feedback = document.querySelector(".feedback");
const items = document.querySelector(".items");
const submtiBtn = document.getElementById("submitBtn");
let editedItemID = 0;

document.addEventListener("DOMContentLoaded", getDataApi);

// get items from api
function getDataApi() {
  const url = "https://5ee340968b27f3001609560b.mockapi.io/mylist/articles";
  const ajax = new XMLHttpRequest();
  ajax.open("GET", url, true);
  ajax.onload = function () {
    if (this.status === 200) {
      const data = JSON.parse(this.responseText);
      displayDataApi(data);
    } else {
      console.log("something went wrong");
    }
  };
  ajax.onerror = function () {
    console.log("error");
  };
  ajax.send();
}

//display items dynamically in the screen
function displayDataApi(data) {
  let info = "";
  data.forEach(function (item) {
    info += ` <li class="list-group-item d-flex align-items-center justify-content-between flex-wrap item my-2">
       <img src="${item.avatar}" id='itemImage' class='itemImage img-thumbnail' alt="">
       <h6 id="itemName" class="text-capitalize itemName">${item.name}</h6>
       <div class="icons">

        <a href='#' class="itemIcon mx-2 edit-icon" data-id='${item.id}'>
         <i class="fas fa-edit"></i>
        </a>
        <a href='#' class="itemIcon mx-2 delete-icon" data-id='${item.id}'>
         <i class="fas fa-trash"></i>
        </a>
       </div>
      </li>`;
  });
  items.innerHTML = info;
  getIcons();
}

submtiBtn.addEventListener("click", submitItems);

// to display alert
function showAlert(text) {
  feedback.classList.add("showItem");
  feedback.textContent = text;

  setTimeout(function () {
    feedback.classList.remove("showItem");
  }, 3000);
}

// to post items to api
function postItemApi(name, img) {
  const avatar = `img/${img}.jpeg`;
  const url = "https://5ee340968b27f3001609560b.mockapi.io/mylist/articles";
  const ajax = new XMLHttpRequest();
  ajax.open("POST", url, true);
  //   this is we need to add when we are posting something
  ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  ajax.onload = function () {
    getDataApi();
  };
  ajax.onerror = function () {
    console.log("error");
  };
  //   first 'name' is on api and second 'name' is we are passing
  ajax.send(`name=${name}&avatar=${avatar}`);
}

// get delete and edit icons
function getIcons() {
  deleteIcons = document.querySelectorAll(".delete-icon");
  editIcons = document.querySelectorAll(".edit-icon");
  deleteItems(deleteIcons);
  editItems(editIcons);
}

// delete items
function deleteItems(deleteIcons) {
  deleteIcons.forEach(function (icon) {
    icon.addEventListener("click", function (e) {
      e.preventDefault();
      const iconId = icon.dataset.id;
      deleteItemApi(iconId);
    });
  });
}
// to delete items from api
function deleteItemApi(id) {
  const url = `https://5ee340968b27f3001609560b.mockapi.io/mylist/articles/${id}`;
  const ajax = new XMLHttpRequest();
  ajax.open("DELETE", url, true);
  ajax.onload = function () {
    getDataApi();
  };
  ajax.onerror = function () {
    console.log("error");
  };
  ajax.send();
}

//submit items
function submitItems(e) {
  e.preventDefault();
  const name = itemInput.value;
  const img = imageInput.value;
  if (name.length === 0 || img.length === 0) {
    showAlert("please enter valid values");
  } else {
    postItemApi(name, img);
    itemInput.value = "";
    imageInput.value = "";
  }
}

// edit icons
function editItems(editIcons) {
  editIcons.forEach(function (icon) {
    icon.addEventListener("click", function (e) {
      e.preventDefault();
      editedItemID = icon.dataset.id;
      const parent = e.target.parentElement.parentElement.parentElement;
      const itemImage = parent.querySelector(".itemImage").src;
      const itemName = parent.querySelector(".itemName").textContent;

      const indexOfImg = itemImage.indexOf("img/");
      const indexOfJpeg = itemImage.indexOf(".jpeg");
      const img = itemImage.slice(indexOfImg + 4, indexOfJpeg);
      itemInput.value = itemName;
      imageInput.value = img;
      submtiBtn.innerHTML = "Edit Item";
      itemList.removeChild(parent);
      submtiBtn.removeEventListener("click", submitItems);
      submtiBtn.addEventListener("click", submitEditedItems);
    });
  });
}

//Edit items
function submitEditedItems(e) {
  e.preventDefault();
  const id = editedItemID;

  const name = itemInput.value;
  const imgValue = imageInput.value;
  const img = `img/${imgValue}.jpeg`;
  if (name.length === 0 || imgValue.length === 0) {
    showAlert("please enter valid values");
  } else {
    updateAPI(id, name, img);
    reverseForm();
  }
}

//Reset form for submitting values
function reverseForm() {
  submtiBtn.innerHTML = "Add Item";
  itemInput.value = "";
  imageInput.value = "";
  submtiBtn.removeEventListener("click", submitEditedItems);
  submtiBtn.addEventListener("click", submitItems);
}

//Update API with edited Items
function updateAPI(id, name, avatar) {
  const url = `https://5ee340968b27f3001609560b.mockapi.io/mylist/articles/${id}`;
  const ajax = new XMLHttpRequest();
  ajax.open("PUT", url, true);
  //   this is needed we need to add when we are posting something
  ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  ajax.onload = function () {
    getDataApi();
  };
  ajax.onerror = function () {
    console.log("error");
  };
  //   first 'name' is on api and second 'name' is we are passing
  ajax.send(`name=${name}&avatar= ${avatar}`);
}
