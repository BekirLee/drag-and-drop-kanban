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

  // enableTaskDragAndDrop(taskDiv);
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
  tasks.forEach(task => {
    console.log(task)
    task.addEventListener('dragstart', (e) => {
      e.target.classList.add('is-dragging');
    });

    task.addEventListener('dragend', (e) => {
      e.target.classList.remove('is-dragging');
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

function getTaskAfterElement(container, mouseY) {
  // Yalnızca görev (`task`) elemanlarını seç
  const tasks = [...container.querySelectorAll('.task:not(.is-dragging)')].filter(task => !task.querySelectorAll('img'));

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


// document.querySelectorAll('.task').forEach(task => enableTaskDragAndDrop(task));
document.querySelectorAll('.column').forEach(column => enableColumnDragAndDrop(column));
