//유저가 값을 입력한다
//+ 버튼을 클릭하면, 할일이 추가된다
// delete버튼을 누르면 할일이 삭제된다
//check버튼을 누르면 할일이 끝나면서 밑줄이 간다
//1. check 버튼을 클릭하는순간 true false
//2. true이면 끝난걸로 간주하고 밑줄 보여주기
//3. false이면 안끝난걸로 간주하고 그대로
//진행중 끝남 탭을 누르면, 언더바가 이동한다
//끝남탭은, 끝남 아이템만, 진행중탭은 진행중인 아이템맘
//전체탭을 누르면 다시 전체아이템으로 돌아옴

let taskInput = document.getElementById("task-input");
let addButton = document.getElementById("add-button");
let tabs = document.querySelectorAll(".task-tabs div");
let taskList = [];
let mode = "all";
addButton.addEventListener("click", addTask);
taskInput.addEventListener("keyup", function(e) {
  if (e.key === "Enter") {
    addTask();
  }
});

for (let i = 1; i < tabs.length; i++) {
  tabs[i].addEventListener("click", function (event) {
    moveUnderline(event);
    filter(event);
  });
}
function moveUnderline(event) {
  let underline = document.getElementById("under-line");
  underline.style.left = event.target.offsetLeft + "px";
  underline.style.width = event.target.offsetWidth + "px";
}
console.log(tabs);
function addTask() {
  let task = {
    id: randomIDGenerate(),
    taskContent: taskInput.value,
    isComplete: false,
  };
  if (taskInput.value.trim() === "") return;
  taskList.push(task);
  taskInput.value = "";
  console.log(taskList);
  render();
}

function render() {
  let resultHTML = "";
  let list = [];
  if (mode === "all") {
    list = taskList;
  } else if (mode === "ongoing") {
    list = taskList.filter((task) => !task.isComplete);
  } else if (mode === "done") {
    list = taskList.filter((task) => task.isComplete);
  }
  for (let i = 0; i < list.length; i++) {
    if (list[i].isComplete == true) {
      resultHTML += `<div class="task"> 
        <div class="task-done">${list[i].taskContent}</div>
        <div>
            <button onclick="toggleComplete('${list[i].id}')">Check</button>
            <button onclick="deleteTask('${list[i].id}')">Delete</button>
        </div>
    </div>`;
    } else {
      resultHTML += `<div class="task"> 
        <div>${list[i].taskContent}</div>
        <div>
            <button onclick="toggleComplete('${list[i].id}')">Check</button>
            <button onclick="deleteTask('${list[i].id}')">Delete</button>
        </div>
    </div>`;
    }
  }
  document.getElementById("task-board").innerHTML = resultHTML;
}

function toggleComplete(id) {
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id == id) {
      taskList[i].isComplete = !taskList[i].isComplete;
      break;
    }
  }
  render();
  console.log(taskList);
}

function deleteTask(id) {
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id == id) {
      taskList.splice(i, 1);
      break;
    }
  }
  render();
}

function filter(event) {
  mode = event.target.id;
  render();
}
function randomIDGenerate() {
  return "_" + Math.random().toString(36).substr(2, 9);
}
