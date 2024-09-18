// 存储图片数据和留言数据到 localStorage
const galleryDataKey = 'galleryData';
const messageDataKey = 'messageData';
let galleryData = JSON.parse(localStorage.getItem(galleryDataKey)) || [];
let messageData = JSON.parse(localStorage.getItem(messageDataKey)) || [];

// 修复留言板无法加载的问题
function renderMessages() {
    messageBoard.innerHTML = '';
    messageData.sort((a, b) => new Date(b.date) - new Date(a.date)); // 按时间倒序排列
    messageData.forEach((message, index) => {
        const messageItem = document.createElement('div');
        messageItem.className = 'message-item';
        messageItem.innerHTML = `
            <p>${message.text}</p>
            <small>${new Date(message.date).toLocaleString()}</small>
            <button onclick="editMessage(${index})">编辑</button>
            <button onclick="deleteMessage(${index})">删除</button>
        `;
        messageBoard.appendChild(messageItem);
    });
}

// 编辑留言功能
function editMessage(index) {
    const newText = prompt('编辑留言:', messageData[index].text);
    if (newText !== null) {
        messageData[index].text = newText;
        localStorage.setItem(messageDataKey, JSON.stringify(messageData)); // 更新留言数据
        renderMessages();  // 重新渲染留言板
    }
}

// 删除留言功能
function deleteMessage(index) {
    messageData.splice(index, 1);  // 删除留言
    localStorage.setItem(messageDataKey, JSON.stringify(messageData));  // 更新本地存储
    renderMessages();  // 重新渲染留言板
}

// 留言板功能
const submitMessage = document.getElementById('submitMessage');
const messageBoard = document.getElementById('messageBoard');
const newMessage = document.getElementById('newMessage');

if (submitMessage) {
    submitMessage.addEventListener('click', function () {
        const messageText = newMessage.value;
        if (messageText.trim() === '') return;  // 防止提交空留言

        const messageItem = {
            text: messageText,
            date: new Date().toISOString(),
        };
        messageData.push(messageItem);
        localStorage.setItem(messageDataKey, JSON.stringify(messageData)); // 保存留言
        renderMessages();
        newMessage.value = '';  // 清空输入框
    });
}

// 页面加载时显示留言
if (messageBoard) {
    renderMessages();
}


// 相册功能

function renderGallery() {
    gallery.innerHTML = '';  // 清空现有图片
    galleryData.forEach((item, index) => {
        const imgContainer = document.createElement('div');
        const img = document.createElement('img');
        img.src = item.url;
        const description = document.createElement('p');
        description.textContent = item.description;

        // 增加编辑和删除按钮
        const editButton = document.createElement('button');
        editButton.textContent = '编辑';
        editButton.addEventListener('click', () => editImageDescription(index));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '×';
        deleteButton.addEventListener('click', () => deleteImage(index));

        imgContainer.appendChild(img);
        imgContainer.appendChild(description);
        imgContainer.appendChild(editButton);
        imgContainer.appendChild(deleteButton);
        gallery.appendChild(imgContainer);
    });
}

// 编辑图片描述功能
function editImageDescription(index) {
    const newDescription = prompt('编辑图片描述:', galleryData[index].description);
    if (newDescription !== null) {
        galleryData[index].description = newDescription;
        localStorage.setItem(galleryDataKey, JSON.stringify(galleryData));  // 更新本地存储
        renderGallery();  // 重新渲染相册
    }
}

// 删除图片功能
function deleteImage(index) {
    galleryData.splice(index, 1);  // 删除图片数据
    localStorage.setItem(galleryDataKey, JSON.stringify(galleryData));  // 更新本地存储
    renderGallery();  // 重新渲染相册
}

// 上传图片
const uploadButton = document.getElementById('uploadButton');
const imageUpload = document.getElementById('imageUpload');
const imageDescription = document.getElementById('imageDescription');
const gallery = document.getElementById('gallery');

if (uploadButton) {
    uploadButton.addEventListener('click', function () {
        const files = imageUpload.files;
        const description = imageDescription.value;

        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imgData = {
                    name: files[i].name,
                    url: e.target.result,
                    description: description || '没有描述',  // 如果没有描述则默认提供描述
                    date: new Date().toISOString(),
                };
                galleryData.push(imgData);
                localStorage.setItem(galleryDataKey, JSON.stringify(galleryData));  // 保存图片数据到本地存储
                renderGallery();  // 更新页面显示
            };
            reader.readAsDataURL(files[i]);
        }
    });
}

// 页面加载时显示相册
if (gallery) {
    renderGallery();
}

// 图片排序
const sortOptions = document.getElementById('sortOptions');
if (sortOptions) {
    sortOptions.addEventListener('change', function () {
        renderGallery();
    });
}


// 脑图功能

const noteAreas = document.querySelectorAll('.note-area');

noteAreas.forEach((noteArea, index) => {
    const title = noteArea.querySelector('h3');
    const content = noteArea.querySelector('p');

    // 自动保存笔记和标题到本地存储
    const saveNoteData = () => {
        localStorage.setItem(`note-title-${index}`, title.textContent);
        localStorage.setItem(`note-content-${index}`, content.textContent);
    };

    title.addEventListener('input', saveNoteData);
    content.addEventListener('input', saveNoteData);

    // 加载已有的笔记和标题
    const savedTitle = localStorage.getItem(`note-title-${index}`);
    const savedContent = localStorage.getItem(`note-content-${index}`);

    if (savedTitle) title.textContent = savedTitle;
    if (savedContent) content.textContent = savedContent;
});
