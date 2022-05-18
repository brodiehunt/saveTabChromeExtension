let folderData = [];


//input elements
const newFolderInput = document.getElementById('folder_input');
const newUrlInput = document.getElementById('url_input');

// buttons
const addFolderBtn = document.getElementById('add_folder_btn');
const addUrlBtn = document.getElementById('add_url_btn');
const saveTabBtn = document.getElementById('save_tab_btn');
const saveAllTabsBtn = document.getElementById('save_all_tabs_btn')
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
saveAllTabsBtn.addEventListener('click', saveAllTabs)
returnBtn.addEventListener('click', returnToFolders);

window.onload = onWindowLoad;

function onWindowLoad() {
  folderData = JSON.parse(localStorage.getItem('folders')) || [];
  console.log(folderData);
  renderFolders(folderData);
}




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
  
  let listItem = document.createElement("li");
  listItem.classList.add('list_item', 'folder');
  listItem.setAttribute('id', `folder_item_${folder.id}`);
  listItem.setAttribute('dataId', `${folder.id}`);

  
  let folderIcon = document.createElement("img");
  folderIcon.classList.add("fa-solid", "fa-folder-closed");
  folderIcon.setAttribute('src', 'folder.png');

  
  let button = document.createElement("button");
  button.classList.add("delete_folder");
  button.innerText = "Delete";
  button.setAttribute("id", folder.id);
  button.addEventListener('click', (e) => {
    deleteFolder(e);
  })

  
  listItem.textContent = folder.name;
  listItem.prepend(folderIcon);
  listItem.append(button);
  

  
  listItem.addEventListener('click', function(e) { 
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
  folderContainerEl.classList.toggle('none');
  linkContainerEl.classList.toggle('none');
  let folderId = event.target.attributes.dataid.value;
  urlList.setAttribute('dataId', folderId)
  let currentFolder = folderData.find((item) => {
    return item.id === folderId;
  })
  
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

// save current tab to folder
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

// function called to save all current tabs to folder

function saveAllTabs() {
  chrome.tabs.query({ currentWindow: true}, function(tabs) {
    let tabsList = tabs
    console.log(tabsList);
    folderData = folderData.map((item) => {
      if (item.id === urlList.getAttribute('dataid')) {
        tabs.forEach((tab) => {
          item.urls.push(tab.url);
          buildUrlListItem(tab.url);
        })
        return item
      }
      return item;
    })
    localStorage.setItem('folders', JSON.stringify(folderData));
  })
}


// Function called to build url and render url
function buildUrlListItem(url) {
  let listItem = document.createElement('li');
  listItem.classList.add('list_item', 'url');

  let urlLink = document.createElement('a');
  urlLink.classList.add('url_link');
  urlLink.setAttribute('href', url);
  urlLink.setAttribute('target', '_blank');
  urlLink.innerText = url;

  let trashIcon = document.createElement("button");
  trashIcon.innerText = 'Delete';
  trashIcon.classList.add("fa-solid", "fa-trash-can", "delete_url" );
  trashIcon.addEventListener('click', (e) => {
    deleteUrl(e);
  })

  listItem.append(urlLink);
  listItem.append(trashIcon);
  urlList.prepend(listItem);
}



// Delete the url from the folder
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

// called to return to view of folders
function returnToFolders() {
  urlList.innerHTML = '';
  folderContainerEl.classList.toggle('none');
  linkContainerEl.classList.toggle('none');
}


// generates a unique id for each folder
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


