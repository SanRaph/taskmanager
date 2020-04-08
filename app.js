//Define UI vars
//form
const form = document.querySelector('#task-form');
//ul list
const taskList = document.querySelector('.collection');
//clear btn
const clearBtn = document.querySelector('.clear-tasks');
//grab the filter
const filter = document.querySelector('#filter');
//grab the task input
const taskInput = document.querySelector('#task');

//we dont want it in the global scope
//load all event listeners
loadEventListeners();

//load all event listener function
function loadEventListeners() {
    //we want the persisted data to show in the ul
    //for that we need a function that gets called
    //so we need an event to load for the func to be called

    //DOM load event, listen for DOMContentLoaded
    document.addEventListener('DOMContentLoaded', getTasks);

    //add task event
    form.addEventListener('submit', addTask);
    //place an event on ul so we can use delegation to remove item by x marks
    //remove task event
    taskList.addEventListener('click', removeTask);
    //clear task event
    clearBtn.addEventListener('click', clearTasks);
    //filter tasks event
    filter.addEventListener('keyup', filterTasks);

}

//get Tasks from LS
function getTasks() {
    let tasks;
    //check to see if there is any task in there
    //retrieve it, read with JSON when it comes out
    //so we get an array, add to it
    if(localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        //set tasks to what's in LS
        //which stores only strings
        //so parse it as JSON when it comes out
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    //we want to loop thru tasks that are there
    tasks.forEach(function(task){
           //we basically wanna create the DOM element
           //with data coming form LS like addTask

            //create list item form scratch
            //create li element
            const li = document.createElement('li');
            //add a class of collection item from materialize
            li.className = 'collection-item';
            //create textNode with values from LS
            const persistText = document.createTextNode(task);
            //now append to li
            li.appendChild(persistText);
            //create new link element
            const link = document.createElement('a');
            //add class, use the secondary class from materialize to put something at right
            link.className = 'delete-item secondary-content';
            //add icon html
            link.innerHTML = '<i class="fa fa-remove"></i>';
            //append link to li 
            li.appendChild(link);

            //Append li to ul
            taskList.appendChild(li);

        });

}
//add task function
function addTask(e) {
    //its an event handler, pass in e object

    //make sure there's is a value
    if(taskInput.value === '') {
        alert('Add a task');
    }

    //create list item form scratch
    //create li element
    const li = document.createElement('li');
    //add a class of collection item from materialize
    li.className = 'collection-item';
    //create textNode from our form values
    const formText = document.createTextNode(taskInput.value);
    //now append to li
    li.appendChild(formText);
    //create new link element
    const link = document.createElement('a');
    //add class, use the secondary class from materialize to put something at right
    link.className = 'delete-item secondary-content';
    //add icon html
    link.innerHTML = '<i class="fa fa-remove"></i>';
    //append link to li 
    li.appendChild(link);

    //now append the li to the ul
    taskList.appendChild(li);
    //code above adds task to the DOM


    //Store in Local Storage
    //store the value that is typed in input
    //so parse it in
    storeTaskInLocalStorage(taskInput.value);

    //clear the input
    taskInput.value = '';

    console.log(li);

    //prevent default
    e.preventDefault();
}

//store task in LS function
//takes in the task
function storeTaskInLocalStorage(task) {
    let tasks;
    //check to see if there is any task in there
    //retrieve it, read with JSON when it comes out
    //so we get an array, add to it
    if(localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        //set tasks to what's in LS
        //which stores only strings
        //so parse it as JSON when it comes out
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    //then push on to tasks var
    //the task that's parse as parameter from function call
    tasks.push(task);

    //then set it back to LS by sending it back 
    //with a stringify, so we send back as string
    localStorage.setItem('tasks', JSON.stringify(tasks));

}

//remove task function
function removeTask(e) {
    //we want the parent of li
    if(e.target.parentElement.classList.contains('delete-item')){
        //remove li which is the parent of a which is the parent of li
        //wrap in confirm
        if(confirm('Are you sure?')){
            e.target.parentElement.parentElement.remove();

            //we delete from the DOM/UI but when we reload
            //everything comes back, becos we havent deleted
            //from LS
            //Remove from LS
            //it's weird becos we dont have any id, we parse actual element
            removeTaskFromLocalStorage(e.target.parentElement.parentElement);
            

        } 
    }
      
}

//remove task from LS function, takes a taskItem
function removeTaskFromLocalStorage(taskItem) {
    //console.log(taskItem);

    //check LS, put in a variable, just like store task LS
    let tasks;
    if(localStorage.getItem('tasks') === null){
        //set variable to an empty array
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
     //loop through it
     tasks.forEach(function(task, index) {
         //check to see if the text content matches the current tasks
         if(taskItem.textContent === task){
            //then we know that's the one we want to delete
            //get index as the 2nd parameter of splice
             tasks.splice(index, 1);
         }
     });
        //set/send back to LS again, 
        localStorage.setItem('tasks', JSON.stringify(tasks));
}

//clear tasks function
function clearTasks() {
    //we could simply clear everything in task list
    //taskList.innerHTML = '';
    
    //we also loop with while loop then remove each one
    //faster, reseach https://jsperf.com/innerhtml-vs-removechild

    //while there is still a firstchild in the list
    //if there still is one
    while(taskList.firstChild) {
        taskList.removeChild(taskList.firstChild);
    }

    //clear tasks from LS, even tho cleared form DOM
    //on reload, data persits
    clearTasksFromLocalStorage()
}

//clear tasks from LS function
function clearTasksFromLocalStorage() {
    //simply call clear on LS
    localStorage.clear();
}

//filter tasks function
function filterTasks(e) {
    //first get whatever is being typed using e object parameter
    //to match correctly, lets turn to lower case
    //gives you whatever target, then the value of that target
    
    const text = e.target.value.toLowerCase();

    //we want to take all of the list items
    //get the nodeList and loop thru
    document.querySelectorAll('.collection-item').forEach(
        function(task) {
            //get the first child and grab its text content
            const item = task.firstChild.textContent;
            //the text has been typed
            //we want to parse into indexOf to search
            //if no match it gives -1, so lets compare
            if(item.toLowerCase().indexOf(text) != -1){
                //then display that task
                task.style.display = 'block';
            } else {
                //if no match hide it
                task.style.display = 'none';
            
            }

        }
    );
    console.log(text);
}