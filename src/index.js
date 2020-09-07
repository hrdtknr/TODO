var todoList;

const DATA_URL = 'http://localhost:8080/todoList';

fetch(DATA_URL)
  .then(function(response){
    return response.json();
  })
 .then(function(jsonData){
   todoList = jsonData;
   //table作成
   generate_table();
  });

function funcInsert() {
  var obj = {
    id: 0,
    name: document.getElementById("newName").value,
    todo: document.getElementById("newTodo").value
  }
  const method = "Post";
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
  const body = JSON.stringify(obj);
  //第2引数は method, headers, body の変数名で送る必要がある
  fetch(DATA_URL, {method, headers, body})
  .then((res)=> res.json())
  .then(console.log).catch(console.error);

  location.reload();
}

//ボタン押したときにテキストボックスの中身を取得する仕組み
function funcUpdate(i){
  var obj = {
    id: parseInt(document.getElementById("editId"+i).textContent, 10),
    name: document.getElementById("editName"+i).value,
    todo: document.getElementById("editTodo"+i).value
  }

  //空文字で上書きしないための処理
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

  location.reload();
}

//削除行のidが渡ってればOK
function funcDelete(i){
  var obj = {
    id: parseInt(i, 10),
    name: "noname",
    todo: "notodo"
  }

  const method = "Delete";
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
  const body = JSON.stringify(obj);
  fetch(DATA_URL, {method, headers, body})
  .then((res)=> res.json())
  .then(console.log).catch(console.error);

  location.reload();
}


//一覧表示処理
function generate_table() {
  // get the reference for the body
  var body = document.getElementsByTagName("body")[0];

  // <table>作成処理
  var tbl = document.createElement("table");

  // <thead>作成処理
  var tblHead = document.createElement("thead");
  var rowH = document.createElement("tr");
  var cell1H = document.createElement("td");
  var cellText1H = document.createTextNode("ID");
  cell1H.appendChild(cellText1H);
  rowH.appendChild(cell1H);

  var cell2H = document.createElement("td");
  var cellText2H = document.createTextNode("NAME");
  cell2H.appendChild(cellText2H);
  rowH.appendChild(cell2H);

  var cell3H = document.createElement("td");
  var cellText3H = document.createTextNode("TODO");
  cell3H.appendChild(cellText3H);
  rowH.appendChild(cell3H);

  var cell4H = document.createElement("td");
  var cellText4H = document.createTextNode("EDIT");
  cell4H.appendChild(cellText4H);
  rowH.appendChild(cell4H);

  var cell5H = document.createElement("td");
  var cellText5H = document.createTextNode("DELETE");
  cell5H.appendChild(cellText5H);
  rowH.appendChild(cell5H);

  tblHead.appendChild(rowH);
  tbl.appendChild(tblHead);//<thead>を<tbody>へ入れる
  // <thead>作成処理ここまで

  // <tbody>作成処理
  var tblBody = document.createElement("tbody");
  //行とセルの中身を作成
  for (var i = 0; i < todoList.length; i++) {
    // creates a table row
    var row = document.createElement("tr");
    // id列
    var cell1 = document.createElement("td");
    var cellText1 = document.createTextNode(todoList[i].id);
    cell1.setAttribute("id", "editId"+todoList[i].id);
    cell1.setAttribute("value", todoList[i].id);
    cell1.appendChild(cellText1);
    row.appendChild(cell1);
    // name列
    var cell2 = document.createElement("td");
    var cellText2 = document.createTextNode(todoList[i].name);
    cell2.setAttribute("id", "nameForBlank"+todoList[i].id);
    cell2.appendChild(cellText2);
    row.appendChild(cell2);
    // todo列
    var cell3 = document.createElement("td");
    var cellText3 = document.createTextNode(todoList[i].todo);
    cell3.setAttribute("id", "todoForBlank"+todoList[i].id);
    cell3.appendChild(cellText3);
    row.appendChild(cell3);
    // edit列
    var cell4 = document.createElement("td");
    var cell4Form = document.createElement("form");
    var cell4InputName = document.createElement("input");
    cell4InputName.setAttribute("type", "text");
    cell4InputName.setAttribute("id", "editName"+todoList[i].id);//htmlのidにDBのIDを付与
    cell4InputName.setAttribute("placeholder", todoList[i].name);
    var cell4InputTodo = document.createElement("input");
    cell4InputTodo.setAttribute("type", "text");
    cell4InputTodo.setAttribute("id", "editTodo"+todoList[i].id);
    cell4InputTodo.setAttribute("placeholder", todoList[i].todo);
    var cell4InputButton = document.createElement("input");
    cell4InputButton.setAttribute("type", "button");
    cell4InputButton.setAttribute("onclick", "funcUpdate("+todoList[i].id+")");
    cell4InputButton.setAttribute("value", "更新");
    //cell4Form.appendChild(cell4InputId);
    cell4Form.appendChild(cell4InputName);
    cell4Form.appendChild(cell4InputTodo);
    cell4Form.appendChild(cell4InputButton);
    cell4.appendChild(cell4Form);
    row.appendChild(cell4);
    // delete列
    var cell5 = document.createElement("td");
    var cell5Form = document.createElement("form");
    var cell5Input = document.createElement("input");
    cell5Input.setAttribute("type", "button");
    cell5Input.setAttribute("onclick", "funcDelete("+todoList[i].id+")");
    cell5Input.setAttribute("value","削除");
    cell5Form.appendChild(cell5Input);
    cell5.appendChild(cell5Form);
    row.appendChild(cell5);
    // add the row to the end of the table body
    tblBody.appendChild(row);
  }
  // put the <tbody> in the <table>
  tbl.appendChild(tblBody);
  // appends <table> into <body>
  body.appendChild(tbl);
  // sets the border attribute of tbl to 2;
  tbl.setAttribute("border", "3");
}

