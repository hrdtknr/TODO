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
  // TODO テキストボックスを空にする処理が必要
  // https://web-tsuku.life/input-text-form-clear/
  // フォームクリアイベントをはさむ
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

// TODO クエリパラメータで送信する方法へ変更
function funcDelete(i){
  // NG　http://localhost:8080/
  // OK　http://localhost:8080/todoList
  // エンドポイントを指定する
  const params = {id: i};
  const qs = new URLSearchParams(params)
  fetch(`http://localhost:8080/todoList?${qs}`).then();

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
// td内に挿入するデータが引数（id,name,todo）
function makeTdForTbody(data){
  //ループ処理用変数宣言
  console.log("data:"+data);
  console.log("id:"+data.id);
  var tmp = [data.id, data.name, data.todo];
  console.log("tmp;"+tmp);
  var setId = ["editId", "nameForBlank", "todoForBlank"];
  // ID, NAME, TODO部分の作成
  var tr = document.getElementById("tableRowId"+data.id);
  var i = 0;
  for(t of tmp){
    console.log("t:"+t)
    var td = document.createElement("td");
    td.setAttribute("id", setId[i]+tmp[0]);
    td.setAttribute("value", t);
    var cell = document.createTextNode(t);
    td.appendChild(cell);
    tr.appendChild(td);
    i++
  }
  /*
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
*/
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

function makeTest(){
  var thColumnName = ['ID', 'NAME', 'TODO', 'EDIT', 'DELETE'];
  var cn = "thead";
  makeTr(cn, thColumnName);
  cn = "tbody";
  makeTr(cn, todoList);
}



//trを作成する関数
//引数cn:thead or tbodyでどちらに作るかを判定
//dataは何行trを作るかの情報
function makeTr(cn, data){//
  var className = document.getElementsByClassName(cn)[0];
  //trを作る処理自体は1回しかしてない
  var tr = document.createElement("tr");
  for(d of data) {
    // ここにthを作成する処理
    if(cn == "thead"){
      var th = document.createElement("th");
      var cell = document.createTextNode(d);
      th.appendChild(cell);
      tr.appendChild(th);
      className.appendChild(tr);
    }
    if(cn == "tbody"){ // tbodyのときだけidを付与（CRUDで使用するため
      var tr = document.createElement("tr");
      tr.setAttribute("id", "tableRowId"+d.id);
      console.log(d);
      //makeTdForTbody(d);
      className.appendChild(tr);
      makeTdForTbody(d);//trができる前にTDを作ろうとしていた のでtr作成td作成の処理順
    }
    //makeTdForTbody(d);
  }
}