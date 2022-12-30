// escapes text to prevent cross site scripting when used
const escape = function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};


// takes in a tasks object and returns a task <article> element containing the entire HTML structure of the task
const createTaskElement = function(task) {

  const $task = `
    <div class="task">
    <div class="task-content">
      <input type="text" class="text" value="${escape(task.name)}" readonly />
    </div>
    <div>
      <button class="edit">Edit</button>
      <button class="delete">Delete</button>
    </div>
    </div>
    `;

  return $task;
};


// gets array of tasks from /tasks and uses renderTasks function to load them on the page
const loadTasks = function() {

  $.get('/tasks', (tasks) => {
    renderTasks(tasks);
  });

};


// loops through tasks and calls createTaskElement to prepend tasks to the tasks container
const renderTasks = function(tasks) {
  $('.tasks-container').empty();

  for (const task of tasks.tasks) {
    const $task = createTaskElement(task);
    $('.tasks-container').prepend($task);
  }

};


// loads tasks when page is loaded and adds a new task on form submission event
$(document).ready(function() {

  $('.new-task-form').on('submit', function(e) {
    e.preventDefault();

    if (!'.new-task-input') {
      alert('Please write a task!');
      return;
    }

    const formData = $('.new-task-input').val();

    $.post('/tasks', {"name": formData}, () => {
      $('.new-task-input').val('');
      loadTasks();
    });

  });

  loadTasks();

});
