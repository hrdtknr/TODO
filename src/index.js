var todoList;

const DATA_URL = 'http://localhost:8080/todoList';

fetch(DATA_URL)
 .then(function(response){
  return response.json();
 })
 .then(function(jsonData){
   console.log("out jsonData");
   console.log(jsonData);

   todoList = jsonData;
   //todoList = JSON.parse(jsonData);//これはエラーがでる
   console.log("out todoList");
   console.log(todoList);

   //table作成
   generate_table();

 });

 var test;//func1内で作成したjson形式のデータを格納
 function func1() {
    var inputName = document.getElementById("newName").value;
    var inputTodo = document.getElementById("newTodo").value;
    //console.log(inputName);console.log(inputTodo);//test出力

    //入力をobjectに
    var obj = {
      id: null,
      name: inputName,
      todo: inputTodo
    }

    //objectをjson形式に変換
    var jsonInsert = JSON.stringify(obj);


    // json形式のテスト出力
    console.log(jsonInsert);
    // web画面に入力値をjson形式で表示
    document.getElementById("out_test").innerHTML = jsonInsert;

    //グローバル変数への代入テスト
    test = jsonInsert;
    console.log(`test json out:${test}`);

    //ここから先にfetch機能でgoへ送る機能が欲しい
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
    cell1.appendChild(cellText1);
    row.appendChild(cell1);
    // name列
    var cell2 = document.createElement("td");
    var cellText2 = document.createTextNode(todoList[i].name);
    cell2.appendChild(cellText2);
    row.appendChild(cell2);
    // todo列
    var cell3 = document.createElement("td");
    var cellText3 = document.createTextNode(todoList[i].todo);
    cell3.appendChild(cellText3);
    row.appendChild(cell3);
    // add the row to the end of the table body
    tblBody.appendChild(row);
  }
  // put the <tbody> in the <table>
  tbl.appendChild(tblBody);
  // appends <table> into <body>
  body.appendChild(tbl);
  // sets the border attribute of tbl to 2;
  tbl.setAttribute("border", "3");

  /*
  <div>
    <input type="button" value="一覧表示" onclick="generate_table()">
  </div>
  でボタンの処理してたけど、fetch内で関数呼び出してる
  */
}


const DATA_URL2 = 'http://localhost:8080/';
/*
function test(){
console.log("test");

  fetch(DATA_URL2)
  .then(function(response){
    return response.json();
  })
  .then(function(jsonData){
    console.log(DATA_URL2);
    console.log("out jsonData");
    console.log(jsonData);

    todoList = jsonData;
    //todoList = JSON.parse(jsonData);//これはエラーがでる
    console.log("out todoList");
    console.log(todoList);

    //table作成
    //generate_table();

  });

}
*/


const obj = {"id":9,"name":"へんしゅう","todo":"てすと"};
console.log(obj);
const method = "POST";
const body = JSON.stringify(obj);
const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};
fetch(DATA_URL, {method, headers, body})
.then((res)=> res.json())
.then(console.log).catch(console.error);