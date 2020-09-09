var todoList;
//kokomade

const DATA_URL = 'http://localhost:8080/todoList';

function getList() {
  fetch(DATA_URL)
  .then(function(response){
    return response.json();
  })
 .then(function(jsonData){
   todoList = jsonData;
   //table作成
   generateTable();
  });
}

function funcInsert() {
  var obj = {
    id: 0,
    name: document.getElementById("newName").value,
    todo: document.getElementById("newTodo").value
  }

  if ( obj.name == "" && obj.todo == "") {
    console.log("name todo blank");

  } else {
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
}

//ボタン押したときにテキストボックスの中身を取得する仕組み
function funcUpdate(i){
  console.log(document.getElementById("editName"+i).value);
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

//table作成処理呼び出し
function generateTable(){
  makeThForThead();
  makeTrForTbody();
}

//table削除処理呼び出し
function deleteTable(){
  // trclasstrの個を消す処理
  // tbodyの子を消す処理
}

// theadにthを作成する関数
function makeThForThead(){
  // ヘッダー列名
  var thColumnName = ['ID', 'NAME', 'TODO', 'EDIT', 'DELETE'];
  // 要素を追加するクラスを指定
  var tr = document.getElementsByClassName("tr")[0];
  // ヘッダー列の数だけ繰り返し<th>を作成
  for(var i = 0; i < thColumnName.length; i++) {
    var th = document.createElement("th");
    var cell = document.createTextNode(thColumnName[i]);
    th.appendChild(cell);
    tr.appendChild(th);
  }
}

// tbodyにtrを作成する関数
function makeTrForTbody(){
  var tbody = document.getElementsByClassName("tbody")[0];
  // ヘッダー列の数だけ繰り返し<th>を作成
  for(var i = 0; i < todoList.length; i++) {
    var tr = document.createElement("tr");
    tr.setAttribute("id", "tableRowId"+todoList[i].id);
    tbody.appendChild(tr);
    //行trを作成した後、その行にtdを作成
    makeTdForTbody(i);
  }
}

// tbodyのtrにtdを作成する関数
function makeTdForTbody(row_id){

  //ループ処理用変数宣言
  var tmp = [todoList[row_id].id, todoList[row_id].name, todoList[row_id].todo];
  var setId = ["editId", "nameForBlank", "todoForBlank"];

  var tr = document.getElementById("tableRowId"+todoList[row_id].id);
  for(var i = 0; i < tmp.length; i++){
    var td = document.createElement("td");
    td.setAttribute("id", setId[i]+tmp[0]);
    // DBのID要素にだけvalueを付与
    // TODO fetchの処理を変更してこのif分を消す
    if (i == 0) {
      td.setAttribute("value", tmp[i]);
    }
    var cell = document.createTextNode(tmp[i]);
    td.appendChild(cell);
    tr.appendChild(td);
  }
  //更新フォーム生成処理
  // TODO ここも同じ処理を繰り返しているのでループで処理
  var tdEdit = document.createElement("td");
  tdEdit.setAttribute("id", "editId"+tmp[0]);//ここで上書きしてた
  var form = document.createElement("form");
  var inputName = document.createElement("input");
  inputName.setAttribute("type", "text");
  inputName.setAttribute("id", "editName"+tmp[0]);//htmlのidにDBのIDを付与
  inputName.setAttribute("placeholder", tmp[1]);//name
  var inputTodo = document.createElement("input");
  inputTodo.setAttribute("type", "text");
  inputTodo.setAttribute("id", "editTodo"+tmp[0]);//htmlのidにDBのIDを付与
  inputTodo.setAttribute("placeholder", tmp[2]);//todo
  var inputButton = document.createElement("input");
  inputButton.setAttribute("type", "button");
  inputButton.setAttribute("onclick", "funcUpdate("+tmp[0]+")");
  inputButton.setAttribute("value", "更新");
  form.appendChild(inputName);
  form.appendChild(inputTodo);
  form.appendChild(inputButton);
  tdEdit.appendChild(form);
  tr.appendChild(tdEdit);

  //削除ボタン生成処理
  // TODO EDITフォームとひとまとめにする
  var tdDelete = document.createElement("td");
  var formDel = document.createElement("form");
  var inputDel = document.createElement("input");
  inputDel.setAttribute("type", "button");
  inputDel.setAttribute("onclick", "funcDelete("+tmp[0]+")");
  inputDel.setAttribute("value","削除");
  formDel.appendChild(inputDel);
  tdDelete.appendChild(formDel);
  tr.appendChild(tdDelete);
}
