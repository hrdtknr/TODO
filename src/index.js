let todoList;
const DATA_URL = 'http://localhost:8080/todoList';
getList();

// jsonデータ取得とテーブル作成
function getList() {
  fetch(DATA_URL)
  .then(function(response){
    return response.json();
  })
 .then(function(jsonData){
   todoList = jsonData;
   generateTable();
  });
}

// insert処理
function insertTodo() {
  let obj = {
    id: 0,
    name: document.getElementById("newName").value,
    todo: document.getElementById("newTodo").value
  }

  if ( !obj.name && !obj.todo) {
    alert("NameかTodoのどちらかは入力してください");
  } else {
    const method = "Post";
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    const body = JSON.stringify(obj);
    fetch(DATA_URL, {method, headers, body})
    .then((res)=> res.json())
    .then(console.log).catch(console.error);
  }
  document.getElementById("newName").value = '';
  document.getElementById("newTodo").value = '';
  redisplayTable();
}

// update処理
function updateTodo(i){
  let obj = {
    id: parseInt(document.getElementById("editId"+i).textContent, 10),
    name: document.getElementById("editName"+i).value,
    todo: document.getElementById("editTodo"+i).value
  }

  if (obj.name == "") {
    obj.name = document.getElementById("nameForBlank"+i).textContent;
  }
  if (obj.todo == "" ) {
    obj.todo = document.getElementById("todoForBlank"+i).textContent;
  }

  const method = "Put";
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
  const body = JSON.stringify(obj);
  fetch(DATA_URL, {method, headers, body})
  .then((res)=> res.json())
  .then(console.log).catch(console.error);

  redisplayTable();
}

// delete処理 クエリパラメータ
function deleteTodo(i){
  const params = {id: i};
  const qs = new URLSearchParams(params)
  fetch(`http://localhost:8080/todoList?${qs}`, {method: 'DELETE'}).then();

  redisplayTable();
}

// table作成処理
function generateTable(){
  let thead = document.getElementsByClassName("thead")[0]
  let tr = document.createElement("tr");
  let column = ['ID', 'NAME', 'TODO', 'EDIT', 'DELETE'];
  for(c of column){
    let th = document.createElement("th");
    let cell = document.createTextNode(c);
    th.appendChild(cell);
    tr.appendChild(th);
    thead.appendChild(tr);
  }

  let tbody = document.getElementsByClassName("tbody")[0]
  for(todo of todoList){
    let tr = document.createElement("tr");
    tr.setAttribute("id", "tableRowId"+todo.id);
    tbody.appendChild(tr);
    makeTdForTbody(todo);
  }
}

// tbodyのtrにtdを作成する関数
function makeTdForTbody(data){
  let tmp = [data.id, data.name, data.todo];
  let setId = ["editId", "nameForBlank", "todoForBlank"];
  let tr = document.getElementById("tableRowId"+data.id);
  let i = 0;
  for(t of tmp){
    let td = document.createElement("td");
    td.setAttribute("id", setId[i]+tmp[0]);
    td.setAttribute("value", t);
    let cell = document.createTextNode(t);
    td.appendChild(cell);
    tr.appendChild(td);
    i++
  }

  let tdEdit = document.createElement("td");
  let form = document.createElement("form");
  let attr = ["editName", "editTodo", "button"];
  i = 0;
  for(a of attr){
    let input = document.createElement("input");
    if(a != "button"){
      input.setAttribute("type", "text");
      input.setAttribute("id", a+tmp[0]);
      input.setAttribute("placeholder", tmp[i+1]);
    } else {
      input.setAttribute("type", "button");
      input.setAttribute("onclick", "updateTodo("+tmp[0]+")");
      input.setAttribute("value", "更新");
    }
    form.appendChild(input);
    i++;
  }
  tdEdit.appendChild(form);
  tr.appendChild(tdEdit);

  const tdDelete = document.createElement("td");
  const formDel = document.createElement("form");
  const inputDel = document.createElement("input");
  inputDel.setAttribute("type", "button");
  inputDel.setAttribute("onclick", "deleteTodo("+tmp[0]+")");
  inputDel.setAttribute("value","削除");
  formDel.appendChild(inputDel);
  tdDelete.appendChild(formDel);
  tr.appendChild(tdDelete);
}

// table削除処理と再表示処理
function redisplayTable(){
  const removeTr = document.getElementById("thead");
  const removeTbody = document.getElementById("tbody");
  removeTr.innerHTML = "";
  removeTbody.innerHTML = "";
  getList();
}
