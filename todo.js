// document.addEventListener('DOMContentLoaded', function () {
//   fetch('http://localhost:3000/progresses')
//     .then(response => response.json())
//     .then(data => {
//       const todoColumn = document.getElementById('todo');
//       const inProgressColumn = document.getElementById('in-progress');
//       const doneColumn = document.getElementById('done');
//       const btns = document.querySelector('button[type="submit"]')

//       data.forEach(task => {
//         const taskElement = createTaskElement(task);

//         // task.addEventListener("dragstart", () => {
//         //   task.classList.add("is-dragging");
//         // });
//         // task.addEventListener("dragend", () => {
//         //   task.classList.remove("is-dragging");
//         // });

//         if (task.status === 'todo') {
//           todoColumn.appendChild(taskElement);
//         } else if (task.status === 'in-progress') {
//           inProgressColumn.appendChild(taskElement);
//         } else if (task.status === 'done') {
//           doneColumn.appendChild(taskElement);
//         }
//       });
//     })
//     .catch(error => console.error('Error:', error));
// });

// function dragdrop(tasks) {
//   tasks.forEach(task => {
//     task.addEventListener("dragstart", () => {
//       task.classList.add("is-dragging");
//     });
//     task.addEventListener("dragend", () => {
//       task.classList.remove("is-dragging");
//     });
//   })
// }

// function addTask() {
//   const title = document.getElementById('new-task-title').value;
//   const status = document.getElementById('new-task-status').value;

//   if (title === '') {
//     alert('Title plz');
//     return;
//   }

//   const newTask = {
//     title: title,
//     status: status
//   };

//   fetch('http://localhost:3000/progresses', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(newTask)
//   })
//     .then(response => response.json())
//     .then(task => {
//       const taskElement = createTaskElement(task);
//       if (task.status === 'todo') {
//         document.getElementById('todo').appendChild(taskElement);
//         document.getElementById('new-task-title').value = ''
//       } else if (task.status === 'in-progress') {
//         document.getElementById('in-progress').appendChild(taskElement);
//         document.getElementById('new-task-title').value = ''
//       } else if (task.status === 'done') {
//         document.getElementById('done').appendChild(taskElement);
//         document.getElementById('new-task-title').value = ''
//       }
//     })
//     .catch(error => console.error('Error:', error));
// }

// function createTaskElement(task) {
//   const taskElement = document.createElement('div');
//   taskElement.className = 'task';
//   taskElement.innerText = task.title;
//   taskElement.dataset.id = task.id;

//   const tasks = document.querySelectorAll('.task');
//   tasks.forEach(task => {
//     task.addEventListener("dragstart", () => {
//       task.classList.add("is-dragging");
//     });
//     task.addEventListener("dragend", () => {
//       task.classList.remove("is-dragging");
//     });
//     // console.log(task.classList.add(''))
//   })
//   // tasks.addEventListener("dragstart", () => {
//   //   task.classList.add("is-dragging");
//   // });
//   // tasks.addEventListener("dragend", () => {
//   //   task.classList.remove("is-dragging");
//   // });

//   // console.log(task);

//   const deleteButton = document.createElement('button');
//   deleteButton.innerText = 'delete';
//   deleteButton.onclick = () => deleteTask(task.id);
//   taskElement.appendChild(deleteButton);

//   return taskElement;
// }

// function deleteTask(id) {
//   fetch(`http://localhost:3000/progresses/${id}`, {
//     method: 'DELETE'
//   })
//     .then(() => {
//       const taskElement = document.querySelector(`.task[data-id='${id}']`);
//       taskElement.parentNode.removeChild(taskElement);
//     })
//     .catch(error => console.error('Error:', error));
// }

// const forms = document.querySelectorAll('form')
// forms.forEach(form => {
//   // console.log(btn)
//   form.addEventListener('submit', (e) => {
//     e.preventDefault();
//   })

// })

// taskShow()
// function taskShow() {
//   const mainTask = document.querySelector('.main-task--buton');
//   const tasks = document.querySelector('.tasks');
//   const body = document.querySelector('body');
//   mainTask.addEventListener('click', () => {
//     tasks.classList.toggle('disabled')
//     body.classList.toggle('background-overlay');
//   })
// }

document.addEventListener('DOMContentLoaded', function () {
  fetch('http://localhost:3000/progresses')
    .then(response => response.json())
    .then(data => {
      const todoColumn = document.getElementById('todo');
      const inProgressColumn = document.getElementById('in-progress');
      const doneColumn = document.getElementById('done');

      data.forEach(task => {
        const taskElement = createTaskElement(task);

        if (task.status === 'todo') {
          todoColumn.appendChild(taskElement);
        } else if (task.status === 'in-progress') {
          inProgressColumn.appendChild(taskElement);
        } else if (task.status === 'done') {
          doneColumn.appendChild(taskElement);
        }
      });
    })
    .catch(error => console.error('Error:', error));
});

function addTask() {
  const title = document.getElementById('new-task-title').value;
  const imageInput = document.getElementById('new-task-image');
  const status = document.getElementById('new-task-status').value;

  if (title === '') {
    alert('Please enter a title');
    return;
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('status', status);
  if (imageInput.files.length > 0) {
    formData.append('image', imageInput.files[0]);
  }
  // console.log(imageInput.files.length)

  fetch('http://localhost:3000/progresses', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(task => {
      const taskElement = createTaskElement(task);
      if (task.status === 'todo') {
        document.getElementById('todo').appendChild(taskElement);
      } else if (task.status === 'in-progress') {
        document.getElementById('in-progress').appendChild(taskElement);
      } else if (task.status === 'done') {
        document.getElementById('done').appendChild(taskElement);
      }
    })
    .catch(error => console.error('Error:', error));
}

function createTaskElement(task) {
  const taskElement = document.createElement('div');
  taskElement.className = 'task';
  taskElement.dataset.id = task.id;

  const titleElement = document.createElement('p');
  titleElement.innerText = task.title;
  taskElement.appendChild(titleElement);

  if (task.imageUrl) {
    const imageElement = document.createElement('img');
    imageElement.src = task.imageUrl;
    imageElement.alt = task.title;
    taskElement.appendChild(imageElement);
  }

  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'Delete';
  deleteButton.onclick = () => deleteTask(task.id);
  taskElement.appendChild(deleteButton);

  return taskElement;
}

function deleteTask(id) {
  fetch(`http://localhost:3000/progresses/${id}`, {
    method: 'DELETE'
  })
    .then(() => {
      const taskElement = document.querySelector(`.task[data-id='${id}']`);
      taskElement.parentNode.removeChild(taskElement);
    })
    .catch(error => console.error('Error:', error));
}

const mainTaskButton = document.querySelector('.main-task--buton');
const tasks = document.querySelector('.tasks');
const body = document.querySelector('body');
mainTaskButton.addEventListener('click', () => {
  tasks.classList.toggle('disabled');
  body.classList.toggle('background-overlay');
});
