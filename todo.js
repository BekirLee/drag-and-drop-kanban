// const form = document.getElementById("todo-form");
// const input = document.getElementById("todo-input");
// const body = document.querySelector('body')

// let todo = document.getElementById("todo");
// let doing = document.getElementById("doing");
// let done = document.getElementById("done");

// const addTask = document.querySelector('.add-task');
// const addTasks = document.querySelector('.add-tasks');
// const menu = document.querySelector('.drop-down--menu');
// const menus = document.querySelector('.menu');

// const btns = document.querySelectorAll('.btn');
// let selectedCol = todo;

// document.querySelector('.btn-todo').addEventListener('click', () => {
//   selectedCol = todo;
// });

// document.querySelector('.btn-doing').addEventListener('click', () => {
//   selectedCol = doing;
// });

// document.querySelector('.btn-done').addEventListener('click', () => {
//   selectedCol = done;
// });

// addTask.addEventListener('click', () => {
//   menu.classList.toggle('disabled')
// })

// addTasks.addEventListener('click', () => {
//   menus.classList.toggle('disabled');
//   body.classList.toggle('body-color')
// })

// form.addEventListener("submit", (e) => {
//   e.preventDefault();
//   const value = input.value;

//   if (!value) return;

//   const newTask = document.createElement("p");
//   newTask.classList.add("task");
//   newTask.setAttribute("draggable", "true");
//   newTask.innerText = value;

//   newTask.addEventListener("dragstart", () => {
//     newTask.classList.add("is-dragging");
//   });

//   newTask.addEventListener("dragend", () => {
//     newTask.classList.remove("is-dragging");
//   });

//   selectedCol.appendChild(newTask);

//   input.value = "";
// });

document.addEventListener('DOMContentLoaded', function () {
  fetch('http://localhost:3000/progresses')
    .then(response => response.json())
    .then(data => {
      const todoColumn = document.getElementById('todo');
      const inProgressColumn = document.getElementById('in-progress');
      const doneColumn = document.getElementById('done');
      const btns = document.querySelector('button[type="submit"]')

      data.forEach(task => {
        const taskElement = createTaskElement(task);

        // task.addEventListener("dragstart", () => {
        //   task.classList.add("is-dragging");
        // });
        // task.addEventListener("dragend", () => {
        //   task.classList.remove("is-dragging");
        // });

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

function dragdrop(tasks) {
  tasks.forEach(task => {
    task.addEventListener("dragstart", () => {
      task.classList.add("is-dragging");
    });
    task.addEventListener("dragend", () => {
      task.classList.remove("is-dragging");
    });
  })
}

function addTask() {
  const title = document.getElementById('new-task-title').value;
  const status = document.getElementById('new-task-status').value;

  if (title === '') {
    alert('Görev başlığını giriniz');
    return;
  }

  const newTask = {
    title: title,
    status: status
  };

  fetch('http://localhost:3000/progresses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newTask)
  })
    .then(response => response.json())
    .then(task => {
      const taskElement = createTaskElement(task);
      if (task.status === 'todo') {
        document.getElementById('todo').appendChild(taskElement);
        document.getElementById('new-task-title').value = ''
      } else if (task.status === 'in-progress') {
        document.getElementById('in-progress').appendChild(taskElement);
        document.getElementById('new-task-title').value = ''
      } else if (task.status === 'done') {
        document.getElementById('done').appendChild(taskElement);
        document.getElementById('new-task-title').value = ''
      }
    })
    .catch(error => console.error('Error:', error));
}

function createTaskElement(task) {
  const taskElement = document.createElement('div');
  taskElement.className = 'task';
  taskElement.innerText = task.title;
  taskElement.dataset.id = task.id;

  const tasks = document.querySelectorAll('.task');
  tasks.forEach(task => {
    task.addEventListener("dragstart", () => {
      task.classList.add("is-dragging");
    });
    task.addEventListener("dragend", () => {
      task.classList.remove("is-dragging");
    });
    // console.log(task.classList.add(''))
  })
  // tasks.addEventListener("dragstart", () => {
  //   task.classList.add("is-dragging");
  // });
  // tasks.addEventListener("dragend", () => {
  //   task.classList.remove("is-dragging");
  // });

  // console.log(task);

  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'delete';
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

const forms = document.querySelectorAll('form')
forms.forEach(form => {
  // console.log(btn)
  form.addEventListener('submit', (e) => {
    e.preventDefault();
  })

})