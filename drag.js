function dragStart() {
    const tasks = document.querySelectorAll('.task');
    const columns = document.querySelectorAll('.column');
    // console.log(tasks)
    let dragged = null;

    tasks.forEach((singleTask) => {
        singleTask.addEventListener('dragstart', () => {
            // console.log('hello!');
            dragged = singleTask;
            console.log(dragged);
        })
        singleTask.addEventListener('dragend', () => {
            console.log('end!')
        })

        columns.forEach((column) => {
            column.addEventListener('dragover', (event) => {
                event.preventDefault();
            });

            column.addEventListener('drop', (event) => {
                event.preventDefault();
                if (dragged) {
                    column.appendChild(dragged);
                }
            });
        });
    })
}