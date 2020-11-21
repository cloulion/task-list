
const list = document.getElementById('task-list');
const form = document.getElementById('add-task-form');
const updateBtn = document.getElementById('update-btn');
let updateId = null;
let newTitle = '';

const renderList = (doc) =>{
    let li = document.createElement('li');
    li.className = 'collection-item';
    li.setAttribute('data-id', doc.id);
    
    let div = document.createElement('div');
    let title = document.createElement('span');
    title.textContent = doc.data().title;
    let link = document.createElement('a');
    link.href = '#modal1';
    link.className = 'modal-trigger secondary-content';
    
    let editBtn = document.createElement('i');
    editBtn.className = 'material-icons';
    editBtn.innerText = 'edit';

    let delBtn = document.createElement('i');
    delBtn.className = 'material-icons secondary-content';
    delBtn.innerText = 'delete';

    link.appendChild(editBtn);
    div.appendChild(title);
    div.appendChild(delBtn);
    div.appendChild(link);
    li.appendChild(div);
    
    delBtn.addEventListener('click', e => {
        let id = e.target.parentElement.parentElement.getAttribute('data-id');
        db.collection('tasks').doc(id).delete();
    })

    editBtn.addEventListener('click', e =>{
        updateId = e.target.parentElement.parentElement.parentElement.getAttribute('data-id');
    })

    list.append(li);
}

updateBtn.addEventListener('click', e => {
    newTitle = document.getElementsByName('new-title')[0].value;
    db.collection('tasks').doc(updateId).update({
        title: newTitle
    })
    document.getElementsByName('new-title')[0].value = '';  
})

form.addEventListener('submit', e =>{
    e.preventDefault();
    db.collection('tasks').add({
        title: form.title.value
    });
    form.title.value = '';
})

db.collection('tasks').orderBy('title').onSnapshot( snapshot =>{
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type === 'added'){
            renderList(change.doc)
        }else if(change.type === 'removed'){
            let li = list.querySelector(`[data-id = ${change.doc.id}]`)
            list.removeChild(li)
        }else if(change.type === 'modified'){
            let li = list.querySelector(`[data-id = ${change.doc.id}]`)
            li.getElementsByTagName('span')[0].textContent = newTitle;
            newTitle = '';
        }
    })
})