// function dragStart() {

    // const tasks = document.querySelectorAll('.task');
    // const droppables = document.querySelectorAll('.column');

//     // Drag event listeners
//     tasks.forEach(task => {
//         task.addEventListener('dragstart', () => {
//             task.classList.add('is-dragging');
//         });

//         task.addEventListener('dragend', () => {
//             task.classList.remove('is-dragging');
//         });
//     });

//     droppables.forEach(zone => {
//         zone.addEventListener('dragover', e => {
//             e.preventDefault();

//             const mouseY = e.clientY;
//             // console.log(mouseY)
//             const bottomTask = insertTaskAtPosition(zone, mouseY);
//             const curTask = document.querySelector('.is-dragging');

//             if (!bottomTask) {
//                 zone.appendChild(curTask);
//             } else {
//                 zone.insertBefore(curTask, bottomTask);
//                 console.log(bottomTask)
//             }
//         });

//         zone.addEventListener('drop', e => {
//             e.preventDefault();
//         });
//     });
// }

// function dragStart() {
//     const tasks = document.querySelectorAll('.task');
//     const columns = document.querySelectorAll('.column');

//     tasks.forEach(task => {
//         task.addEventListener('dragstart', () => {
//             task.classList.add('is-dragging');
//         });

//         task.addEventListener('dragend', () => {
//             task.classList.remove('is-dragging');
//         });
//     });

//     columns.forEach(column => {
//         enableDragAndDrop(column);
//     });
// }