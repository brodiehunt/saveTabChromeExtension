let folderData = [];
const newFolderInput = document.getElementById('folder_input');
const addFolderBtn = document.getElementById('add_folder_btn');
const folderList = document.getElementById('folder_list');




addFolderBtn.addEventListener('click', addFolder);


function addFolder() {
  if (newFolderInput.value) {
    let newFolder = {id: folderData.length, name: newFolderInput.value, urls: []};
    folderData.push(newFolder);
    localStorage.setItem('folders', JSON.stringify(folderData));
    renderFolders();
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