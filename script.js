let folderData = [];


//input elements
const newFolderInput = document.getElementById('folder_input');
const newUrlInput = document.getElementById('url_input');

// buttons
const addFolderBtn = document.getElementById('add_folder_btn');
const addUrlBtn = document.getElementById('add_url_btn');
const saveTabBtn = document.getElementById('save_tab_btn');
const returnBtn = document.getElementById('return_btn');

// ul elements for folder list and url list
const folderList = document.getElementById('folder_list');
const urlList = document.getElementById('url_list');

// deleteButtons
let deleteFolderButtons = document.querySelectorAll('.delete_button')

//containers that display is toggled
const folderContainerEl = document.getElementById('folder_container');
const linkContainerEl = document.getElementById('link_container');

// add button event listensers
addFolderBtn.addEventListener('click', addFolder);
addUrlBtn.addEventListener('click', addUrl);
saveTabBtn.addEventListener('click', saveCurrentTab);
returnBtn.addEventListener('click', returnToFolders);

window.onload = onWindowLoad;

function onWindowLoad() {
  folderData = JSON.parse(localStorage.getItem('folders')) || [];
  console.log(folderData);
  renderFolders(folderData);
}





// delete folder event listeners
// deleteFolderButtons.forEach((button) => {
//   button.addEventListener('click', (e) => {
//     console.log(e)
//   })
// })

// add singular folder to folder list
function addFolder() {
  if (newFolderInput.value) {
    let folderId = generateId()
    let newFolder = {id: folderId, name: newFolderInput.value, urls: []};
    folderData.push(newFolder);
    localStorage.setItem('folders', JSON.stringify(folderData));
    renderFolder(newFolder);
    newFolderInput.value = '';
  }
}


function renderFolders(foldersArray) {
  foldersArray.forEach((item) => {
    renderFolder(item);
  })
  
}


// render singular folder after being added, or called multiple times onload
function renderFolder(folder) {
  // Create folderList Item
  let listItem = document.createElement("li");
  listItem.classList.add('folder_item');
  listItem.setAttribute('id', `folder_item_${folder.id}`);
  listItem.setAttribute('dataId', `${folder.id}`);

  // Create Icons for Folder List items
  let folderIcon = document.createElement("img");
  folderIcon.classList.add("fa-solid", "fa-folder-closed");
  folderIcon.setAttribute('src', 'folder.png');

  // Create delete button and add event listener
  let button = document.createElement("button");
  button.classList.add("delete_folder");
  button.innerText = "delete";
  button.setAttribute("id", folder.id);
  button.addEventListener('click', (e) => {
    deleteFolder(e);
  })

  // Append Folder list item to folder list
  listItem.textContent = folder.name;
  listItem.prepend(folderIcon);
  listItem.append(button);
  

  // add event listener to folder; 
  listItem.addEventListener('click', function(e) {
    console.log("event listener for foler working", e);
    // toggle all elements to display none, toggle all the unseen elements to display block;
    // display: render all the url from the folder into 
    toggleListFolderItems(e);
  })
  folderList.prepend(listItem);
}


// delete folder when trash button clicked
function deleteFolder(event) {
  event.stopPropagation();
  event.preventDefault();
  let folderId = event.target.id;
  let folderIndex = folderData.findIndex((folder) => folder.id == folderId);
  folderData.splice(folderIndex, 1);
  localStorage.setItem('folders', JSON.stringify(folderData));
  let listItemEl = document.getElementById(`folder_item_${folderId}`);
  listItemEl.remove();

}

// All the URL related functions


// Function will be added to clickable list item
function toggleListFolderItems(event) {
  
  // build and render all of the individual urls and display them. 
  folderContainerEl.classList.toggle('none');
  linkContainerEl.classList.toggle('none');

  let folderId = event.target.attributes.dataid.value;
  urlList.setAttribute('dataId', folderId)
  let currentFolder = folderData.find((item) => {
    return item.id === folderId;
  })

  
  // now render all urls from currentURL list;
  renderUrls(currentFolder.urls);
}



// function called when folder is first clicked, renders any urls currently in the folder 
function renderUrls(urlArray) {
    urlArray.forEach((item) => {
      buildUrlListItem(item)
    })
}

// Function that adds new url to url list 

function addUrl() {
  let url = newUrlInput.value;
  if (url) {
    folderData = folderData.map((item) => {
      if (item.id === urlList.getAttribute('dataid')) {
        item.urls.push(url);
        return item
      }
      return item;
    })
    localStorage.setItem('folders', JSON.stringify(folderData));
    buildUrlListItem(url);
    newUrlInput.value = '';
  }
}

function saveCurrentTab() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    let url = tabs[0].url;
    folderData = folderData.map((item) => {
      if (item.id === urlList.getAttribute('dataid')) {
        item.urls.push(url);
        return item
      }
      return item;
    })
    localStorage.setItem('folders', JSON.stringify(folderData));
    buildUrlListItem(url);
  })
}

// Function called to build url and render url
function buildUrlListItem(url) {
  let listItem = document.createElement('li');
  listItem.classList.add('url_item');

  let urlLink = document.createElement('a');
  urlLink.classList.add('url_link');
  urlLink.setAttribute('href', url);
  urlLink.setAttribute('target', '_blank');
  urlLink.innerText = url;

  let trashIcon = document.createElement("button");
  trashIcon.innerText = 'delete';
  trashIcon.classList.add("fa-solid", "fa-trash-can", "delete_url" );
  trashIcon.addEventListener('click', (e) => {
    deleteUrl(e);
  })

  listItem.append(urlLink);
  listItem.append(trashIcon);
  urlList.prepend(listItem);
}


function deleteUrl(event) {
  let url = event.target.parentNode.innerText;
  let listItemUrl = event.target.parentNode;
  folderData = folderData.map((item) => {
    if (item.id === urlList.getAttribute('dataid')) {
      let index = item.urls.indexOf(url)
      item.urls.splice(index, 1);
      return item
    }
    return item;
  })
  localStorage.setItem('folders', JSON.stringify(folderData));
  listItemUrl.remove();

}

function returnToFolders() {
  urlList.innerHTML = '';
  folderContainerEl.classList.toggle('none');
  linkContainerEl.classList.toggle('none');
}






function generateId() {
  let alphabet= "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let number = "0123456789";
  let possibleChar = alphabet + number;
  let arrayOfChar = possibleChar.split('');
  let password = '';
  for (i = 0; i < 6; i++) {
    let randomNum = Math.floor(Math.random() * arrayOfChar.length);
    password += arrayOfChar[randomNum];
  }
  console.log(password);
  return password;
}


