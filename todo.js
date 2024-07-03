const mainBtn = document.querySelector('.main-task--buton');
const mainTaskBox = document.querySelector('.tasks');
const board = document.querySelector('.board');

let isClicked = false;

mainBtn.addEventListener('click', (e) => {
  mainTaskBox.classList.toggle('disabled');
  board.classList.toggle('background-overlay');

  if (isClicked) {
    e.target.innerHTML = 'Add Task';
  } else {
    e.target.innerHTML = 'Quit';
  }
  isClicked = !isClicked;
});

fetchTasks();

async function addTask() {
  const title = document.getElementById('new-task-title').value;
  const image = document.getElementById('new-task-image').files[0];
  const status = document.getElementById('new-task-status').value;

  if (!title) {
    alert("Task need!");
    return;
  }

  const task = {
    title: title,
    status: status,
    image: null
  };

  if (image) {
    const reader = new FileReader();
    reader.onload = async function (event) {
      task.image = event.target.result;
      const savedTask = await sendTaskToServer(task);
      addTaskToBoard(savedTask);
    }
    reader.readAsDataURL(image);
  } else {
    const savedTask = await sendTaskToServer(task);
    addTaskToBoard(savedTask);
  }

  document.getElementById('new-task-title').value = '';
  document.getElementById('new-task-image').value = '';
  document.getElementById('new-task-status').value = 'todo';
}

async function sendTaskToServer(task) {
  try {
    const response = await fetch('http://localhost:3000/progresses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    });
    if (!response.ok) {
      throw new Error('Error');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

function addTaskToBoard(task) {
  const taskDiv = document.createElement('div');
  taskDiv.classList.add('task');
  taskDiv.setAttribute('data-id', task.id);
  taskDiv.setAttribute('draggable', true);
  taskDiv.innerHTML = `
    <h4>${task.title}</h4>
    ${task.image ? `<img class='task-photo' src="${task.image}" />` : '---'}
    <button onclick="deleteTask('${task.id}')">Delete</button>
  `;
  document.getElementById(task.status).appendChild(taskDiv);

  dragStart();
}

async function fetchTasks() {
  try {
    const response = await fetch('http://localhost:3000/progresses');
    if (!response.ok) {
      throw new Error('error');
    }
    const tasks = await response.json();
    tasks.forEach(task => addTaskToBoard(task));
  } catch (error) {
    console.error(error);
  }
}

async function deleteTask(id) {
  try {
    const response = await fetch(`http://localhost:3000/progresses/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Görev silinirken hata oluştu');
    }
    const taskDiv = document.querySelector(`.task[data-id='${id}']`);
    if (taskDiv) {
      taskDiv.remove();
    }
  } catch (error) {
    console.error(error);
  }
}

// const mainBtn = document.querySelector('.main-task--buton');
// const mainTaskBox = document.querySelector('.tasks');
// const board = document.querySelector('.board');

// let isClicked = false;

// mainBtn.addEventListener('click', (e) => {
//   mainTaskBox.classList.toggle('disabled');
//   board.classList.toggle('background-overlay');

//   if (isClicked) {
//     e.target.innerHTML = 'Add Task';
//   } else {
//     e.target.innerHTML = 'Quit';
//   }
//   isClicked = !isClicked;
// });

// fetchTasks();

// async function addTask() {
//   const title = document.getElementById('new-task-title').value;
//   const image = document.getElementById('new-task-image').files[0];
//   const status = document.getElementById('new-task-status').value;

//   if (!title) {
//     alert("Task title is required!");
//     return;
//   }

//   const task = {
//     title: title,
//     status: status,
//     image: null
//   };

//   if (image) {
//     const reader = new FileReader();
//     reader.onload = async function (event) {
//       task.image = event.target.result;
//       const savedTask = await sendTaskToServer(task);
//       addTaskToBoard(savedTask);
//     }
//     reader.readAsDataURL(image);
//   } else {
//     const savedTask = await sendTaskToServer(task);
//     addTaskToBoard(savedTask);
//   }

//   document.getElementById('new-task-title').value = '';
//   document.getElementById('new-task-image').value = '';
//   document.getElementById('new-task-status').value = 'todo';
// }

// async function sendTaskToServer(task) {
//   try {
//     const response = await fetch('http://localhost:3000/progresses', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(task)
//     });
//     if (!response.ok) {
//       throw new Error('Error');
//     }
//     return await response.json();
//   } catch (error) {
//     console.error(error);
//   }
// }

// function addTaskToBoard(task) {
//   const taskDiv = document.createElement('div');
//   taskDiv.classList.add('task');
//   taskDiv.setAttribute('data-id', task.id);
//   taskDiv.setAttribute('draggable', true);
//   taskDiv.innerHTML = `
//     <h4>${task.title}</h4>
//     ${task.image ? `<img class='task-photo' src="${task.image}" />` : '---'}
//     <button onclick="deleteTask('${task.id}')">Delete</button>
//   `;
//   document.getElementById(task.status).appendChild(taskDiv);

//   // Drag and drop functionality for tasks
//   dragStart();
// }

// async function fetchTasks() {
//   try {
//     const response = await fetch('http://localhost:3000/progresses');
//     if (!response.ok) {
//       throw new Error('Error fetching tasks');
//     }
//     const tasks = await response.json();
//     tasks.forEach(task => addTaskToBoard(task));
//   } catch (error) {
//     console.error(error);
//   }
// }

// async function deleteTask(id) {
//   try {
//     const response = await fetch(`http://localhost:3000/progresses/${id}`, {
//       method: 'DELETE'
//     });
//     if (!response.ok) {
//       throw new Error('Error deleting task');
//     }
//     // Remove task from DOM
//     const taskDiv = document.querySelector(`.task[data-id='${id}']`);
//     if (taskDiv) {
//       taskDiv.remove();
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }

// function dragStart() {
//   const tasks = document.querySelectorAll('.task');
//   const columns = document.querySelectorAll('.column');
//   let dragged = null;

//   tasks.forEach((singleTask) => {
//     singleTask.addEventListener('dragstart', () => {
//       dragged = singleTask;
//       setTimeout(() => {
//         singleTask.style.opacity = '0.5';
//       }, 0);
//     });

//     singleTask.addEventListener('dragend', () => {
//       setTimeout(() => {
//         singleTask.style.opacity = '1';
//         dragged = null;
//       }, 0);
//     });

//     columns.forEach((column) => {
//       column.addEventListener('dragover', (event) => {
//         event.preventDefault();
//       });

//       column.addEventListener('drop', (event) => {
//         event.preventDefault();
//         if (dragged) {
//           const newStatus = column.id;
//           updateTaskStatus(dragged.getAttribute('data-id'), newStatus);
//           column.appendChild(dragged);
//         }
//       });
//     });
//   });
// }

// async function updateTaskStatus(id, newStatus) {
//   try {
//     const response = await fetch(`http://localhost:3000/progresses/${id}`, {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ status: newStatus })
//     });
//     if (!response.ok) {
//       throw new Error('Error updating task status');
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }
