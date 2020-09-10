var todoList;

const DATA_URL = 'http://localhost:8080/todoList';
getList();

function getList() {
  fetch(DATA_URL)
  .then(function(response){
    return response.json();
  })
 .then(function(jsonData){
   todoList = jsonData;
   generateTable();// table作成
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
    // 第2引数は method, headers, body の変数名で送る必要がある
    fetch(DATA_URL, {method, headers, body})
    .then((res)=> res.json())
    .then(console.log).catch(console.error);

    redisplayTable();
  }
  document.getElementById("newName").value = '';
  document.getElementById("newTodo").value = '';
}

// ボタン押したときにテキストボックスの中身を取得する仕組み
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

  redisplayTable();
}

// クエリパラメータで送信する
function funcDelete(i){
  // NG　http://localhost:8080/
  // OK　http://localhost:8080/todoList
  // エンドポイントを指定する
  const params = {id: i};
  const qs = new URLSearchParams(params)
  fetch(`http://localhost:8080/todoList?${qs}`, {method: 'DELETE'}).then();

  redisplayTable();
}

//table作成処理呼び出し
function generateTable(){
  // thead のtr作成
  var thead = document.getElementsByClassName("thead")[0]
  var tr = document.createElement("tr");
  var column = ['ID', 'NAME', 'TODO', 'EDIT', 'DELETE']; //thead column
  for(c of column){
    var th = document.createElement("th");
    var cell = document.createTextNode(c);
    th.appendChild(cell);
    tr.appendChild(th);
    thead.appendChild(tr);
  }

  // tbody のtr作成
  var tbody = document.getElementsByClassName("tbody")[0]
  for(todo of todoList){
    var tr = document.createElement("tr");
    tr.setAttribute("id", "tableRowId"+todo.id);
    tbody.appendChild(tr);
    makeTdForTbody(todo); //td作成処理
  }
}

// tbodyのtrにtdを作成する関数
// td内に挿入するデータが引数（id,name,todo）
function makeTdForTbody(data){
  //ループ処理用変数宣言
  var tmp = [data.id, data.name, data.todo];
  var setId = ["editId", "nameForBlank", "todoForBlank"];
  // ID, NAME, TODO部分の作成
  var tr = document.getElementById("tableRowId"+data.id);
  var i = 0;
  for(t of tmp){
    var td = document.createElement("td");
    td.setAttribute("id", setId[i]+tmp[0]);
    td.setAttribute("value", t);
    var cell = document.createTextNode(t);
    td.appendChild(cell);
    tr.appendChild(td);
    i++
  }
  //更新フォーム生成処理
  var tdEdit = document.createElement("td");
  var form = document.createElement("form");
  var attr = ["editName", "editTodo"];
  // TODO setaattrに書きたい内容をStringの配列で保持して拡張for文?
  for(var i = 0; i < 3; i++){
    var input = document.createElement("input");
    if(i != 2){
      input.setAttribute("type", "text");
      input.setAttribute("id", attr[i]+tmp[0]);//htmlのidにDBのIDを付与
      input.setAttribute("placeholder", tmp[i+1]);
    } else { //ボタン生成時の処理
      input.setAttribute("type", "button");
      input.setAttribute("onclick", "funcUpdate("+tmp[0]+")");
      input.setAttribute("value", "更新");
    }
    form.appendChild(input);
  }
  tdEdit.appendChild(form);
  tr.appendChild(tdEdit);

  //削除ボタン生成処理
  // TODO EDITフォームとひとまとめにできるか考える
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

//table削除処理呼び出し
function redisplayTable(){
  var removeTr = document.getElementById("thead");
  var removeTbody = document.getElementById("tbody");
  removeTr.innerHTML = "";
  removeTbody.innerHTML = "";
  getList();
}
