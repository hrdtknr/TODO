package main

import (
	"fmt"
	"database/sql"
	"log"
	"time"
	"net/http"
//	"encoding/json"
	"strconv"

	"html/template"

	_ "github.com/go-sql-driver/mysql"
)

//構造体の変数名の戦闘を大文字にしないとテンプレートファイルに読みこめない
type Todo struct {
	ID int
	Name string
	Todo string
}

//Todo型の構造体TodoList
type TodoList []Todo

var todoList TodoList

var db, err =sql.Open("mysql", "root:1234@tcp(127.0.0.1:3306)/go")
/*
if err != nil {
	panic(err.Error())
}
defer db.Close() //defer:延期する
*/


func main() {

	getDB()


	port := "8080"

	http.Handle("/", http.FileServer(http.Dir("./src")))
	http.HandleFunc("/todoList", handleIndex) //go側でインポート設定する必要があった

//	http.handleFunc("/test", handleTest)



	log.Printf("listening port %s", port)
	log.Print(http.ListenAndServe(":"+port, nil))

	db.Close()//今はエラー出てないから大丈夫だけどここでcloseは危険な気がする
}

func handleIndex(w http.ResponseWriter, r *http.Request){
	getDB()
	t, err := template.ParseFiles("src/index.html")
	if err != nil {
		log.Fatalf("src error: %v", err)
	}
	if err := t.Execute(w, todoList) //第二引数の内容を渡す
	err != nil {
		log.Printf("failed to execute template: %v", err)
	}

	//以下の処理を別枠に移したい
	log.Printf(r.FormValue("edit"))
	if(r.FormValue("edit") == "test_sendvalue"){
		log.Println("sucsess")
//		insert("Form", timeToString(time.Now()))
	} else {
		log.Println("no")
	}

	//invoke delete method
	log.Printf(r.FormValue("delete"))
	i, err := strconv.Atoi(r.FormValue("delete")) // string -> int
	delete(i) // send delete id


	//check input data
	log.Println(r.FormValue("newName"))
	log.Println(r.FormValue("newTodo"))
	//invoke insert method
	if (r.FormValue("add") == "add") {
		insert(r.FormValue("newName"), r.FormValue("newTodo"))
	}

	log.Println(r.FormValue("edit"))
	log.Println(r.FormValue("editName"))
	log.Println(r.FormValue("editTodo"))
	i2, err := strconv.Atoi(r.FormValue("edit"))
	update(i2, r.FormValue("editName"), r.FormValue("editTodo"))
}

func getDB(){
	rows, err:= db.Query("SELECT * FROM todo")
	defer rows.Close()
	if err != nil {
		log.Println(err)
		return
	}

	//ここで仮のリスト
	var todoListTmp TodoList

	for rows.Next(){
		var id int
		var name string
		var todo string
		if err := rows.Scan(&id, &name, &todo); err != nil{
			log.Println(err)
			return
		}

		//初期化せずにどんどん構造体に追加してるっぽい
		// Todo型の変数todoTmpに取得した情報を代入
		todoTmp:= Todo {
			ID: id,
			Name: name,
			Todo: todo,
		}
		//配列todoListに要素を追加
		//変数名は工夫したい(分かりにくい)
		todoListTmp = append(todoListTmp, todoTmp)
		//ここで上書き処理をすればいいのでは
	}

	//仮リストの中身を元リストへ代入（appendではない
	todoList = todoListTmp
}
/*
//これも動いてないかも
func TestHandler(w http.ResponseWriter, r *http.Request){
	w.Header().Set("Content-type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(todoList)
}
*/

func insert(name string, todo string){
	ins, err := db.Prepare("INSERT INTO todo(name, todo) VALUES(?,?)")
	if err != nil { //error処理まででひとつのカタマリ
		log.Println(err)
		return
	}
	ins.Exec(name, todo)
}

func delete(id int){
	del, err := db.Prepare("DELETE FROM todo WHERE id = ?")
	if err != nil {
		log.Println(err)
		return
	}
	del.Exec(id)
}

func update(id int, name string, todo string){
	upd, err := db.Prepare("UPDATE todo SET name = ?, todo = ? WHERE id = ?")
	if err != nil {
		log.Println(err)
		return
	}
	upd.Exec(name, todo, id)
}

func read(){
	rows, err:= db.Query("SELECT * FROM todo")
	defer rows.Close()
	if err != nil {
		log.Println(err)
		return
	}

	for rows.Next(){
		var id int
		var  name string
		var todo string
		if err := rows.Scan(&id, &name, &todo); err != nil{
			log.Println(err)
			return
		}
		fmt.Println(id, name, todo)
	}
}



/*
//time型<->string型
//使わないので後で消す
var layout = "2006-01-02 15:04:05"
func stringToTime(str string) time.Time {
	t, _ := time.Parse(layout, str)
	return t
}
func timeToString(t time.Time) string {
	str := t.Format(layout)
	return str
}
*/