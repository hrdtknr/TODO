
const DATA_URL = 'http://localhost:8080/todoList';

fetch(DATA_URL)
 .then(function(response){
  return response.json();
 })
 .then(function(jsonData){
  console.log(jsonData);
  //効率的な書き方がありそう
  document.write('<table>');
  document.write('<thead>');
  document.write('<tr>');
  document.write('<th>ID</th>');
  document.write('<th>NAME</th>');
  document.write('<th>TODO</th>');
  document.write('</tr>');
  document.write('</thead>');
  document.write('<tbody>');
  for(var i = 0; i < jsonData.length; i++){
    document.write(`<tr><td>${jsonData[i].id}</td><td>${jsonData[i].name}</td><td>${jsonData[i].todo}</td></tr>`);
  }
  document.write('</tbody>');
  document.write('</table>');
 });