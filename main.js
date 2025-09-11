// ================================
// Todo App (고득점용 개선 버전)
// - 예외 처리(빈 값/중복) + 이벤트 위임
// - localStorage 상태 저장 (tasks, mode)
// - 탭 언더라인 애니메이션 & 유지
// - 접근성 레이블, 깔끔한 Bootstrap UI
// ================================

const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => [...parent.querySelectorAll(sel)];

const taskInput = $("#task-input");
const addButton = $("#add-button");
const helperMsg = $("#helper-msg");
const taskBoard = $("#task-board");
const emptyState = $("#empty-state");
const tabs = $$(".tab-btn");
const underline = $("#under-line");

const countAll = $("#count-all");
const countOngoing = $("#count-ongoing");
const countDone = $("#count-done");

let taskList = [];
let mode = "all";

// ---------- 유틸 ----------
const randomID = () => "_" + Math.random().toString(36).slice(2, 11);

const escapeHTML = (str) =>
  str.replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

// ---------- 저장/로드 ----------
function saveState() {
  localStorage.setItem("todo.tasks", JSON.stringify(taskList));
  localStorage.setItem("todo.mode", mode);
}

function loadState() {
  taskList = JSON.parse(localStorage.getItem("todo.tasks") || "[]");
  mode = localStorage.getItem("todo.mode") || "all";
  // 탭 active 반영
  tabs.forEach((b) => {
    const active = b.dataset.mode === mode;
    b.classList.toggle("active", active);
    b.setAttribute("aria-selected", active ? "true" : "false");
  });
}

// ---------- 렌더 ----------
function render() {
  const list =
    mode === "ongoing"
      ? taskList.filter((t) => !t.isComplete)
      : mode === "done"
      ? taskList.filter((t) => t.isComplete)
      : taskList;

  // 카운트 업데이트
  countAll.textContent = taskList.length;
  countOngoing.textContent = taskList.filter((t) => !t.isComplete).length;
  countDone.textContent = taskList.filter((t) => t.isComplete).length;

  // 비어있는 상태 표시
  if (list.length === 0) {
    taskBoard.innerHTML = "";
    emptyState.classList.remove("d-none");
  } else {
    emptyState.classList.add("d-none");
    // 이벤트 위임을 위해 data-*만 주입
    const html = list
      .map((t) => {
        const content = escapeHTML(t.taskContent);
        return `
          <div class="task ${t.isComplete ? "completed" : ""}" role="listitem" data-id="${t.id}">
            <div class="task-content">${content}</div>
            <div class="task-actions">
              <button class="btn ${t.isComplete ? "btn-outline-secondary" : "btn-outline-success"} btn-sm action-toggle" data-action="toggle" aria-label="완료 전환">
                ${t.isComplete ? '<i class="bi bi-arrow-counterclockwise"></i> 되돌리기' : '<i class="bi bi-check2-circle"></i> 완료'}
              </button>
              <button class="btn btn-outline-danger btn-sm action-delete" data-action="delete" aria-label="삭제">
                <i class="bi bi-trash3"></i> 삭제
              </button>
            </div>
          </div>
        `;
      })
      .join("");
    taskBoard.innerHTML = html;
  }

  // 언더라인 위치 재정렬
  moveUnderlineToActive();
  saveState();
}

// ---------- 언더라인 ----------
function moveUnderlineToActive() {
  const activeTab = $(".tab-btn.active");
  if (!activeTab) return;
  const { offsetLeft, offsetWidth } = activeTab;
  underline.style.left = `${offsetLeft}px`;
  underline.style.width = `${offsetWidth}px`;
}

// ---------- 추가 ----------
function addTask() {
  const text = taskInput.value.trim();
  helperMsg.classList.add("d-none");
  helperMsg.textContent = "";

  if (!text) {
    helperMsg.textContent = "내용을 입력하세요.";
    helperMsg.classList.remove("d-none");
    taskInput.focus();
    return;
  }

  const duplicate = taskList.some((t) => t.taskContent.trim().toLowerCase() === text.toLowerCase());
  if (duplicate) {
    helperMsg.textContent = "이미 동일한 할 일이 있습니다.";
    helperMsg.classList.remove("d-none");
    taskInput.focus();
    return;
  }

  taskList.push({
    id: randomID(),
    taskContent: text,
    isComplete: false,
    createdAt: Date.now(),
  });

  taskInput.value = "";
  render();
  taskInput.focus();
}

// ---------- 토글/삭제 ----------
function toggleComplete(id) {
  const t = taskList.find((x) => x.id === id);
  if (t) t.isComplete = !t.isComplete;
  render();
}

function deleteTask(id) {
  taskList = taskList.filter((x) => x.id !== id);
  render();
}

// ---------- 필터 ----------
function setMode(newMode) {
  if (mode === newMode) return;
  mode = newMode;
  tabs.forEach((b) => {
    const active = b.dataset.mode === mode;
    b.classList.toggle("active", active);
    b.setAttribute("aria-selected", active ? "true" : "false");
  });
  render();
}

// ---------- 이벤트 바인딩 ----------
document.addEventListener("DOMContentLoaded", () => {
  loadState();
  render();
  moveUnderlineToActive();
});

addButton.addEventListener("click", addTask);

taskInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") addTask();
});

// 탭 클릭(이벤트 위임 아님: 버튼 각각에 바인딩)
tabs.forEach((btn) => {
  btn.addEventListener("click", () => setMode(btn.dataset.mode));
});

// 항목 동작(이벤트 위임)
taskBoard.addEventListener("click", (e) => {
  const actionBtn = e.target.closest("[data-action]");
  if (!actionBtn) return;

  const card = e.target.closest(".task");
  if (!card) return;
  const id = card.dataset.id;
  const action = actionBtn.dataset.action;

  if (action === "toggle") toggleComplete(id);
  else if (action === "delete") deleteTask(id);
});

// 리사이즈 시 언더라인 보정
window.addEventListener("resize", moveUnderlineToActive);
