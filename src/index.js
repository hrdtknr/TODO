var todoList;

const DATA_URL = 'http://localhost:8080/todoList';

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
  // TODO テキストボックスを空にする処理が必要
  // 新規TODOもjsの関数で表示して再表示する処理
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

// TODO クエリパラメータで送信する方法へ変更
function funcDelete(){
  var url = new URL("http://localhost:8080/"),
    params = {id: 100}
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  fetch(url).then();

  redisplayTable();
}

//table作成処理呼び出し
function generateTable(){
  makeThForThead();
  makeTrForTbody();
}

//table削除処理呼び出し
function redisplayTable(){
  var removeTr = document.getElementById("tr");
  var removeTbody = document.getElementById("tbody");
  removeTr.innerHTML = "";
  removeTbody.innerHTML = "";
  getList();
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
  // ID, NAME, TODO部分の作成
  var tr = document.getElementById("tableRowId"+todoList[row_id].id);
  for(var i = 0; i < tmp.length; i++){
    var td = document.createElement("td");
    td.setAttribute("id", setId[i]+tmp[0]);
    td.setAttribute("value", tmp[i]);
    var cell = document.createTextNode(tmp[i]);
    td.appendChild(cell);
    tr.appendChild(td);
  }

  //更新フォーム生成処理
  var tdEdit = document.createElement("td");
  var form = document.createElement("form");
  var attr = ["editName", "editTodo"];
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
