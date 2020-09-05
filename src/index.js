document.write("<p>javascript test</p>");
document.write("<h2>javascript test 2</h2>");

document.write("<h2>よみこめている</h2>");

/*
document.getElementById('demo').onclick = function changeContent() {

  document.getElementById('demo').innerHTML = "Help me";
  document.getElementById('demo').style = "Color: red";

}


const button = document.querySelector('button');

button.addEventListener('click', event => {
  button.innerHTML = `Click count: ${event.detail}`;
});
*/
fetch('http://localhost:8080/todoList')
  .then(response => response.json())
  .then(data => console.log(data));

// POST メソッドの実装の例
async function postData(url = 'http://localhost:8080/todoList', data = {}) {
  // 既定のオプションには * が付いています
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // 本文のデータ型は "Content-Type" ヘッダーと一致する必要があります
  })
  return response.json(); // レスポンスの JSON を解析
}

postData('http://localhost:8080/todoList', { answer: 42 })
  .then(data => {
    console.log(data); // `data.json()` の呼び出しで解釈された JSON データ
  });