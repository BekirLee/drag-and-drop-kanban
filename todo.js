const mainBtn = document.querySelector('.main-task--button');
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

fetchColumnsAndTasks();

async function fetchColumnsAndTasks() {
  await fetchColumns();
  await fetchTasks();
}

async function addTask() {
  const title = document.getElementById('new-task--title').value;
  const image = document.getElementById('new-task--image').files[0];
  const status = document.getElementById('new-task--status').value;

  if (!title) {
    alert("Task title is required!");
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
    };
    reader.readAsDataURL(image);
  } else {
    const savedTask = await sendTaskToServer(task);
    addTaskToBoard(savedTask);
  }

  document.getElementById('new-task--title').value = '';
  document.getElementById('new-task--image').value = '';
  document.getElementById('new-task--status').value = 'todo';
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
      throw new Error('Error saving task');
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
  taskDiv.setAttribute('draggable', true); // Make task draggable
  taskDiv.innerHTML = `
    <h4>${task.title}</h4>
    ${task.image ? `<img class='task-photo' src="${task.image}" />` : '---'}
    <button onclick="deleteTask('${task.id}')">Delete</button>
  `;
  const taskContainer = document.getElementById(task.status).querySelector('.tasks-container');
  if (taskContainer) {
    taskContainer.appendChild(taskDiv);
    enableTaskDragAndDrop(taskDiv);
  } else {
    console.error(`No tasks-container found in column with ID ${task.status}`);
  }
}

async function fetchTasks() {
  try {
    const response = await fetch('http://localhost:3000/progresses');
    if (!response.ok) {
      throw new Error('Error fetching tasks');
    }
    const tasks = await response.json();
    tasks.forEach(task => addTaskToBoard(task));
  } catch (error) {
    console.error('Error fetching tasks', error);
  }
}

async function deleteTask(id) {
  try {
    const response = await fetch(`http://localhost:3000/progresses/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Error deleting task');
    }
    const taskDiv = document.querySelector(`.task[data-id='${id}']`);
    if (taskDiv) {
      taskDiv.remove();
    }
  } catch (error) {
    console.error(error);
  }
}

document.getElementById('add-column-btn').addEventListener('click', addColumn);

async function addColumn() {
  const columnName = prompt("Enter column name:");
  if (!columnName) return;

  const column = {
    title: columnName
  };

  const savedColumn = await saveColumnToServer(column);
  addColumnToBoard(savedColumn);
  addColumnToSelect(savedColumn.title, savedColumn.id);
}

async function saveColumnToServer(column) {
  try {
    const response = await fetch('http://localhost:3000/columns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(column)
    });
    if (!response.ok) {
      console.log('Error saving column');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

async function fetchColumns() {
  try {
    const response = await fetch('http://localhost:3000/columns');
    if (!response.ok) {
      console.log('Error fetching columns');
    }
    const columns = await response.json();
    console.log(columns);
    columns.forEach(column => {
      addColumnToBoard(column);
      addColumnToSelect(column.title, column.id);
    });
  } catch (error) {
    console.error('Error fetching columns', error);
  }
}

function addColumnToBoard(column) {
  const columnDiv = document.createElement('div');
  columnDiv.classList.add('column');
  columnDiv.setAttribute('id', column.id);
  columnDiv.innerHTML = `<h2>${column.title}</h2><div class="tasks-container"></div>`;
  board.appendChild(columnDiv);
  enableColumnDragAndDrop(columnDiv);
}

function addColumnToSelect(columnName, columnId) {
  const select = document.getElementById('new-task--status');
  const option = document.createElement('option');
  option.value = columnId;
  option.text = columnName;
  select.appendChild(option);
}

function enableTaskDragAndDrop(task) {
  task.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', e.target.dataset.id);
    e.target.classList.add('is-dragging');
  });

  task.addEventListener('dragend', (e) => {
    e.target.classList.remove('is-dragging');
  });
}

function enableColumnDragAndDrop(column) {
  column.addEventListener('dragover', (e) => {
    e.preventDefault();
    const taskBeingDragged = document.querySelector('.is-dragging');
    if (taskBeingDragged) {
      const taskContainer = column.querySelector('.tasks-container');
      if (taskContainer && taskContainer.children.length > 0) {
        taskContainer.appendChild(taskBeingDragged);
      }
    }
  });

  column.addEventListener('drop', (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    const taskBeingDragged = document.querySelector(`.task[data-id='${taskId}']`);
    const taskContainer = column.querySelector('.tasks-container');
    if (taskContainer && taskContainer.children.length > 0) {
      taskContainer.appendChild(taskBeingDragged);
      updateTaskStatus(taskId, column.id);
    }
  });
}

async function updateTaskStatus(taskId, newStatus) {
  try {
    const response = await fetch(`http://localhost:3000/progresses/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    });
    if (!response.ok) {
      throw new Error('Error updating task status');
    }
  } catch (error) {
    console.error('Error updating task status', error);
  }
}

document.addEventListener('dragover', (e) => {
  e.preventDefault();
});

document.addEventListener('drop', (e) => {
  e.preventDefault();
});




// const mainBtn = document.querySelector('.main-task--button');
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

// async function fetchColumnsAndTasks() {
//   await fetchColumns();
//   await fetchTasks();
// }

// fetchColumnsAndTasks();

// async function addTask() {
//   const title = document.getElementById('new-task--title').value;
//   const image = document.getElementById('new-task--image').files[0];
//   const status = document.getElementById('new-task--status').value;

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
//     };
//     reader.readAsDataURL(image);
//   } else {
//     const savedTask = await sendTaskToServer(task);
//     addTaskToBoard(savedTask);
//   }

//   document.getElementById('new-task--title').value = '';
//   document.getElementById('new-task--image').value = '';
//   document.getElementById('new-task--status').value = 'todo';
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
//       throw new Error('Error saving task');
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

//   // Check if the element exists before trying to append the taskDiv
//   const taskContainer = document.getElementById(task.status);
//   if (taskContainer) {
//     const tasksContainer = taskContainer.querySelector('.tasks-container');
//     if (tasksContainer) {
//       tasksContainer.appendChild(taskDiv);
//       enableTaskDragAndDrop(taskDiv);
//     } else {
//       console.error(`No element with class 'tasks-container' found in ${task.status}`);
//     }
//   } else {
//     console.error(`No element with ID ${task.status} found`);
//   }
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
//     console.error('Error fetching tasks', error);
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
//     const taskDiv = document.querySelector(`.task[data-id='${id}']`);
//     if (taskDiv) {
//       taskDiv.remove();
//     }
//   } catch (error) {
//     console.error('Error deleting task:', error);
//   }
// }

// async function fetchColumns() {
//   // Add your implementation to fetch columns here
// }

// function enableTaskDragAndDrop(taskDiv) {
//   // Add your implementation to enable task drag and drop here
// }