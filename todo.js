const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");

let todo = document.getElementById("todo");
let doing = document.getElementById("doing");
let done = document.getElementById("done");

const addTask = document.querySelector('.add-task');
const addTasks = document.querySelector('.add-tasks');
const menu = document.querySelector('.drop-down--menu');
const menus = document.querySelector('.menu');

const btns = document.querySelectorAll('.btn');
let selectedCol = todo;

document.querySelector('.btn-todo').addEventListener('click', () => {
  selectedCol = todo;
});

document.querySelector('.btn-doing').addEventListener('click', () => {
  selectedCol = doing;
});

document.querySelector('.btn-done').addEventListener('click', () => {
  selectedCol = done;
});

addTask.addEventListener('click', () => {
  menu.classList.toggle('disabled')
})

addTasks.addEventListener('click', () => {
  menus.classList.toggle('disabled')
})

// console.log(todoLane)

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = input.value;

  if (!value) return;

  const newTask = document.createElement("p");
  newTask.classList.add("task");
  newTask.setAttribute("draggable", "true");
  newTask.innerText = value;

  newTask.addEventListener("dragstart", () => {
    newTask.classList.add("is-dragging");
  });

  newTask.addEventListener("dragend", () => {
    newTask.classList.remove("is-dragging");
  });

  selectedCol.appendChild(newTask);


  // btns.forEach((hell) => {
  //   let btnContent = hell.textContent
  //   if (btnContent == todo.textContent) {
  //     todo.appenChild(newTask)
  //   }
  //   else if (btnContent == doing.textContent) {
  //     doing.appendChild(newTask)
  //   }
  //   else {
  //     done.appendChild(newTask);
  //   }
  // })

  input.value = "";
});
