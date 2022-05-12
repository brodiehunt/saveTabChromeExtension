let folderData = [];
const newFolderInput = document.getElementById('folder_input');
const addFolderBtn = document.getElementById('add_folder_btn');
const folderList = document.getElementById('folder_list');
let deleteFolderButtons = document.querySelectorAll('.delete_button')



addFolderBtn.addEventListener('click', addFolder);

deleteFolderButtons.forEach((button) => {
  button.addEventListener('click', (e) => {
    console.log(e)
  })
})

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

function renderFolders() {
  let htmlString = '';
  folderData.forEach((folder) => {
    let string = `<li class="folder_item" id="folder_item${folder.id}">
                    <i class="fa-solid fa-folder-closed"></i>
                    ${folder.name}
                  </li>`
    htmlString += string;
  })
  folderList.innerHTML = htmlString;
}

function renderFolder(folder) {
  // Create folderList Item
  let listItem = document.createElement("li");
  listItem.classList.add('folder_item');
  listItem.setAttribute('id', `folder_item_${folder.id}`);

  // Create Icons for Folder List items
  let folderIcon = document.createElement("i");
  folderIcon.classList.add("fa-solid", "fa-folder-closed");

  let trashIcon = document.createElement("i");
  trashIcon.classList.add("fa-solid", "fa-trash-can");

  // Create delete button and add event listener
  let button = document.createElement("button");
  button.classList.add("delete_folder");
  button.setAttribute("id", folder.id);

  button.addEventListener('click', (e) => {
    console.log("trash button works", e)
    deleteFolder(e);
  })

  // Append Folder list item to folder list
  listItem.textContent = folder.name;
  listItem.prepend(folderIcon);
  listItem.append(button);
  button.append(trashIcon);
  folderList.append(listItem);
}

function deleteFolder(event) {
  // Get the id from the button
  // update the array by removing the folder from it;
  // write the new array into localStorage
  // Remove the rendered Folder From the screen;
  event.stopPropagation();
  let folderId = event.target.parentNode.id;
  let folderIndex = folderData.findIndex((folder) => folder.id == folderId);
  folderData.splice(folderIndex, 1);
  localStorage.setItem('folders', JSON.stringify(folderData));
  let listItemEl = document.getElementById(`folder_item_${folderId}`);
  listItemEl.remove();

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


