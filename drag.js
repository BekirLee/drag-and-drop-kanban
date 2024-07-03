// function dragStart() {
//     const tasks = document.querySelectorAll('.task');
//     const columns = document.querySelectorAll('.column');
//     // console.log(tasks)
//     let dragged = null;

//     tasks.forEach((singleTask) => {
//         singleTask.addEventListener('dragstart', () => {
//             // console.log('hello!');
//             dragged = singleTask;
//             console.log(dragged);
//         })
//         singleTask.addEventListener('dragend', () => {
//             console.log('end!')
//         })

//         columns.forEach((column) => {
//             column.addEventListener('dragover', (event) => {
//                 event.preventDefault();
//             });

//             column.addEventListener('drop', (event) => {
//                 event.preventDefault();
//                 if (dragged) {
//                     column.appendChild(dragged);
//                 }
//             });
//         });
//     })
// }


function dragStart() {
    //     const tasks = document.querySelectorAll('.task');
    //     const columns = document.querySelectorAll('.column');
    //     let dragged = null;

    //     tasks.forEach((singleTask) => {
    //         singleTask.addEventListener('dragstart', () => {
    //             dragged = singleTask;
    //             singleTask.classList.add('is-dragging')
    //         });

    //         singleTask.addEventListener('dragend', () => {
    //             dragged = null;
    //         });

    //         columns.forEach((column) => {
    //             column.addEventListener('dragover', (event) => {
    //                 event.preventDefault();
    //             });

    //             column.addEventListener('drop', (event) => {
    //                 event.preventDefault();
    //                 if (dragged) {
    //                     column.appendChild(dragged);
    //                     updateTaskStatus(dragged.dataset.id, column.id);
    //                 }
    //             });
    //         });
    //     });
    // }

    // async function updateTaskStatus(id, newStatus) {
    //     try {
    //         const response = await fetch(`http://localhost:3000/progresses/${id}`, {
    //             method: 'PATCH',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({ status: newStatus })
    //         });
    //         if (!response.ok) {
    //             throw new Error('error when updating');
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    // drag.js

    const tasks = document.querySelectorAll('.task');
    const droppables = document.querySelectorAll('.column');

    // Drag event listeners
    tasks.forEach(task => {
        task.addEventListener('dragstart', () => {
            task.classList.add('is-dragging');
        });

        task.addEventListener('dragend', () => {
            task.classList.remove('is-dragging');
        });
    });

    droppables.forEach(zone => {
        zone.addEventListener('dragover', e => {
            e.preventDefault();

            const mouseY = e.clientY;
            // console.log(mouseY)
            const bottomTask = insertTaskAtPosition(zone, mouseY);
            const curTask = document.querySelector('.is-dragging');

            if (!bottomTask) {
                zone.appendChild(curTask);
            } else {
                zone.insertBefore(curTask, bottomTask);
                console.log(bottomTask)
            }
        });

        zone.addEventListener('drop', e => {
            e.preventDefault();
        });
    });


    // Function to insert task at the correct position based on mouse position
    function insertTaskAtPosition(zone, mouseY) {
        const tasks = zone.querySelectorAll('.task:not(.is-dragging)');
        let closestTask = null;
        let closestOffset = Number.POSITIVE_INFINITY;

        tasks.forEach(task => {
            const { top, bottom } = task.getBoundingClientRect();
            const offsetTop = mouseY - top;
            const offsetBottom = bottom - mouseY;

            if (offsetTop > 0 && offsetTop < closestOffset) {
                closestTask = task.nextElementSibling;;
                closestOffset = offsetTop;
            }

            if (offsetBottom > 0 && offsetBottom < closestOffset) {
                closestTask = task;
                closestOffset = offsetBottom;
            }
        });

        return closestTask;
    }

}
