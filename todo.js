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
  taskDiv.setAttribute('draggable', true);
  taskDiv.innerHTML = `
    <h4>${task.title}</h4>
    ${task.image ? `<img class='task-photo' src="${task.image}" />` : '---'}
    <button onclick="deleteTask('${task.id}')">Delete</button>
  `;
  document.getElementById(task.status).appendChild(taskDiv);

  enableTaskDragAndDrop(taskDiv);
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
  columnDiv.setAttribute('draggable', true);
  columnDiv.innerHTML = `<h2>${column.title}</h2><div class="tasks-container"></div>`;
  document.getElementById('board').appendChild(columnDiv);
  enableColumnDragAndDrop(columnDiv);
}

function addColumnToSelect(columnName, columnId) {
  const select = document.getElementById('new-task--status');
  const option = document.createElement('option');
  option.value = columnId;
  option.text = columnName;
  select.appendChild(option);
}

function enableColumnDragAndDrop(column) {
  column.addEventListener('dragstart', (e) => {
    e.target.classList.add('is-dragging');
  });

  column.addEventListener('dragend', (e) => {
    e.target.classList.remove('is-dragging');
  });

  column.addEventListener('dragover', (e) => {
    e.preventDefault();
    const mouseX = e.clientX;
    const draggingColumn = document.querySelector('.is-dragging');
    const afterColumn = getColumnAfterElement(mouseX);
    if (!afterColumn) {
      board.appendChild(draggingColumn);
    } else {
      board.insertBefore(draggingColumn, afterColumn);
    }
  });

  column.addEventListener('drop', (e) => {
    e.preventDefault();
  });
}

function getColumnAfterElement(mouseX) {
  const columns = [...board.querySelectorAll('.column:not(.is-dragging)')];
  return columns.reduce((closest, column) => {
    const box = column.getBoundingClientRect();
    const offset = mouseX - box.left - box.width / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: column };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function enableTaskDragAndDrop() {
  const tasks = document.querySelectorAll('.task');
  // console.log(tasks)
  tasks.forEach(task => {
    console.log(task)
    task.addEventListener('dragstart', (e) => {
      e.target.classList.add('is-dragging');
    });

    task.addEventListener('dragend', (e) => {
      e.target.classList.remove('is-dragging');
      console.log('end')
    });

    task.addEventListener('dragover', (e) => {
      e.preventDefault();

    });

    task.addEventListener('drop', (e) => {
      e.preventDefault();
      const mouseY = e.clientY;
      const draggingTask = document.querySelector('.is-dragging');
      const afterTask = getTaskAfterElement(task.parentElement, mouseY);
      if (!afterTask) {
        task.parentElement.appendChild(draggingTask);
      } else {
        task.parentElement.insertBefore(draggingTask, afterTask);
      }
    });
  })
}

async function enableTaskDragAndDrop() {
  const tasks = document.querySelectorAll('.task');

  tasks.forEach(task => {
    task.addEventListener('dragstart', (e) => {
      e.target.classList.add('is-dragging');
    });

    task.addEventListener('dragend', async (e) => {
      e.target.classList.remove('is-dragging');
      console.log('end');
    });

    task.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    task.addEventListener('drop', async (e) => {
      e.preventDefault();
      const draggingTask = document.querySelector('.is-dragging');
      const column = e.target.closest('.column');
      console.log(column)

      // Hedef sütunun mevcut olup olmadığını kontrol et
      if (!column) {
        console.error('Drop target is not a column');
        return;
      }

      const newColumnId = column.id;
      const container = column.querySelector('.tasks-container');
      console.log(container)

      // Konteynerin mevcut olup olmadığını kontrol et
      if (!container) {
        console.error('Tasks container is not found in the column');
        return;
      }

      const afterTask = getTaskAfterElement(container, e.clientY);

      if (!afterTask) {
        container.appendChild(draggingTask);
      } else {
        container.insertBefore(draggingTask, afterTask);
      }

      // Update task status in the server
      const taskId = draggingTask.getAttribute('data-id');
      await updateTaskStatus(taskId, newColumnId);
    });
  });
}

async function updateTaskStatus(taskId, newStatus) {
  try {
    await fetch(`http://localhost:3000/progresses/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    });
  } catch (error) {
    console.error('Error updating task status', error);
  }
}

function getTaskAfterElement(container, mouseY) {
  const tasks = [...container.querySelectorAll('.task:not(.is-dragging)')];

  return tasks.reduce((closest, task) => {
    const box = task.getBoundingClientRect();
    const offset = mouseY - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: task };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}


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