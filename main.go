package main

import (
	"fmt"
	"database/sql"
	"log"
//	"time"
	"net/http"
	"encoding/json"
//	"strconv"
	"bytes"
	"os"
	"html/template"
	"io/ioutil"

	_ "github.com/go-sql-driver/mysql"
)

//構造体の変数名の戦闘を大文字にしないとテンプレートファイルに読みこめない
type Todo struct {
	ID int `json:"id"`
	Name string `json:"name"`
	Todo string `json:"todo"`
}

//Todo型の配列TodoList
type TodoList []Todo

var todoList TodoList

var db, err =sql.Open("mysql", "root:1234@tcp(127.0.0.1:3306)/go")
/*
if err != nil {
	panic(err.Error())
}
defer db.Close() //defer:延期する
*/
const URL = "http://localhost:8080"

func main() {

	//DBからデータを取得して、構造体を作成
	getDB()

	//構造体をjsonに変換
	todoList_json, _ := json.Marshal(todoList)

  //totoListをjson形式でファイル出力テスト
	os.Stdout.Write(todoList_json)
	content := []byte(todoList_json)
	ioutil.WriteFile("todoList.json", content, os.ModePerm)

	port := "8080"

	http.Handle("/", http.FileServer(http.Dir("./src")))
	http.HandleFunc("/todoList", handleIndex) //go側でインポート設定する必要があった

	log.Printf("listening port %s", port)
	log.Print(http.ListenAndServe(":"+port, nil))

	// HTTP json 送るテスト
	res, err := http.Post(URL, "application/json", bytes.NewBuffer(todoList_json))
	defer res.Body.Close()
	if err != nil {
			fmt.Println("[!] " + err.Error())
	} else {
			fmt.Println("[*] " + res.Status)
	}

	db.Close()//今はエラー出てないから大丈夫だけどここでcloseは危険な気がする
}

//goのプラグイン入れて定義ジャンプ
func handleIndex(w http.ResponseWriter, r *http.Request){//この中にURLが入ってて、クエリとGETを組み合わせる
	getDB()
	t, err := template.ParseFiles("src/index.html")
	if err != nil {
		log.Fatalf("src error: %v", err)
	}
	if err := t.Execute(w, todoList) //第二引数の内容を渡す
	err != nil {
		log.Printf("failed to execute template: %v", err)
	}
}

func getDB(){
	rows, err:= db.Query("SELECT * FROM todo")
	defer rows.Close()
	if err != nil {
		log.Println(err)
		return
	}

	//仮のリスト
	var todoListTmp TodoList

	for rows.Next(){
		var id int
		var name string
		var todo string
		if err := rows.Scan(&id, &name, &todo); err != nil{
			log.Println(err)
			return
		}
		// Todo型の変数todoTmpに取得した情報を代入
		todoTmp:= Todo {
			ID: id,
			Name: name,
			Todo: todo,
		}
		//配列todoListに要素を追加
		todoListTmp = append(todoListTmp, todoTmp)
	}
	//仮リストの中身を元リストへ代入（appendではない
	todoList = todoListTmp
}

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
