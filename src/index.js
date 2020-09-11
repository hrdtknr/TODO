let todoList;
const DATA_URL = "http://localhost:8080/todoList";
getList();

// jsonデータ取得とテーブル作成
function getList() {
  fetch(DATA_URL)
    .then(function (response) {
      return response.json();
    })
    .then(function (jsonData) {
      todoList = jsonData;
      generateTable();
    });
}

// insert処理
function insertTodo() {
  let obj = {
    id: 0,
    name: document.getElementById("newName").value,
    todo: document.getElementById("newTodo").value,
  };

  if (!obj.name && !obj.todo) {
    alert("NameかTodoのどちらかは入力してください");
  } else {
    const method = "Post";
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    const body = JSON.stringify(obj);
    fetch(DATA_URL, { method, headers, body })
      .then((res) => res.json())
      .then(console.log)
      .catch(console.error);
  }
  document.getElementById("newName").value = "";
  document.getElementById("newTodo").value = "";
  redisplayTable();
}

// update処理
function updateTodo(i) {
  let obj = {
    id: parseInt(document.getElementById("editId" + i).textContent, 10),
    name: document.getElementById("editName" + i).value,
    todo: document.getElementById("editTodo" + i).value,
  };

  if (obj.name == "") {
    obj.name = document.getElementById("nameForBlank" + i).textContent;
  }
  if (obj.todo == "") {
    obj.todo = document.getElementById("todoForBlank" + i).textContent;
  }

  const method = "Put";
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const body = JSON.stringify(obj);
  fetch(DATA_URL, { method, headers, body })
    .then((res) => res.json())
    .then(console.log)
    .catch(console.error);

  redisplayTable();
}

// delete処理 クエリパラメータ
function deleteTodo(i) {
  const params = { id: i };
  const qs = new URLSearchParams(params);
  fetch(`http://localhost:8080/todoList?${qs}`, { method: "DELETE" }).then();

  redisplayTable();
}

// table作成処理
function generateTable() {
  const thead = document.getElementsByClassName("thead")[0];
  const tr = document.createElement("tr");
  const column = ["ID", "NAME", "TODO", "EDIT", "DELETE"];
  for (c of column) {
    const th = document.createElement("th");
    const cell = document.createTextNode(c);
    th.appendChild(cell);
    tr.appendChild(th);
    thead.appendChild(tr);
  }

  const tbody = document.getElementsByClassName("tbody")[0];
  for (todo of todoList) {
    const tr = document.createElement("tr");
    tr.setAttribute("id", "tableRowId" + todo.id);
    tbody.appendChild(tr);
    makeTdForTbody(todo);
  }
}

// tbodyのtrにtdを作成する関数
function makeTdForTbody(todo) {
  const setAttrData = [
    { id: "editId" + todo.id, value: todo.id },
    { id: "nameForBlank" + todo.id, value: todo.name },
    { id: "todoForBlank" + todo.id, value: todo.todo },
  ];
  const tr = document.getElementById("tableRowId" + todo.id);
  Object.keys(setAttrData).forEach((key) => {
    const td = document.createElement("td");
    td.setAttribute("id", setAttrData[key].id);
    td.setAttribute("value", setAttrData[key].value);
    const cell = document.createTextNode(setAttrData[key].value);
    td.appendChild(cell);
    tr.appendChild(td);
  });

  const tdEdit = document.createElement("td");
  const form = document.createElement("form");
  inputAttr = {
    name: {
      type: "text",
      id: "editName" + todo.id,
      placeholder: todo.name,
    },
    todo: {
      type: "text",
      id: "editTodo" + todo.id,
      placeholder: todo.todo,
    },
    button: {
      type: "button",
      onclick: "updateTodo(" + todo.id + ")",
      value: "更新",
    },
  };
  Object.keys(inputAttr).forEach((obj) => {
    const input = document.createElement("input");
    Object.keys(inputAttr[obj]).forEach((key) => {
      input.setAttribute(key, inputAttr[obj][key]);
    });
    form.appendChild(input);
  });
  tdEdit.appendChild(form);
  tr.appendChild(tdEdit);

  const tdDelete = document.createElement("td");
  const formDel = document.createElement("form");
  const inputDel = document.createElement("input");
  inputDel.setAttribute("type", "button");
  inputDel.setAttribute("onclick", "deleteTodo(" + todo.id + ")");
  inputDel.setAttribute("value", "削除");
  formDel.appendChild(inputDel);
  tdDelete.appendChild(formDel);
  tr.appendChild(tdDelete);
}

// table削除処理と再表示処理
function redisplayTable() {
  const removeTr = document.getElementById("thead");
  const removeTbody = document.getElementById("tbody");
  removeTr.innerHTML = "";
  removeTbody.innerHTML = "";
  getList();
}
