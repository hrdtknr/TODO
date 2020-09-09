package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	_ "github.com/go-sql-driver/mysql"
)

// 構造体の変数名の先頭を大文字にしないとテンプレートファイルに読みこめない
type Todo struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
	Todo string `json:"todo"`
}

// Todo型の配列TodoList
type TodoList []Todo

var (
	todoList TodoList
	// DB接続設定
	// TODO js側の設定が終えたら 定義をdb = *sql.DBに変更してsql.Openの処理をmain内へ
	db, err = sql.Open("mysql", "root:1234@tcp(127.0.0.1:3306)/go")
)
// go側を変更する前の状態にして、先にjs側の変更を
func main() {
	// http://localhost:8080/ にアクセスしたとき、ソースの".src"内のhtmlファイルを表示する
	http.Handle("/", http.FileServer(http.Dir("./src")))
	http.HandleFunc("/todoList", handleIndex) // go側でインポート設定する必要があった
	port := "8080"
	log.Printf("listening port %s", port)
	log.Print(http.ListenAndServe(":"+port, nil))

	db.Close() // TODO closeする場所確認
}

func handleIndex(w http.ResponseWriter, r *http.Request) { // この中にURLが入ってて、クエリとGETを組み合わせる
	var todoDecode Todo // 構造体Todo型の変数
	switch r.Method {
	case http.MethodGet:
		getDB()
		res, err := json.Marshal(todoList) // dbからの情報が入ったtodoListをjson形式にして変数resへ
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(res)
	case http.MethodPost:
		err := json.NewDecoder(r.Body).Decode(&todoDecode)
		checkDecodeError(err)
		insert(todoDecode.Name, todoDecode.Todo)
	case http.MethodDelete:
		err := json.NewDecoder(r.Body).Decode(&todoDecode)
		checkDecodeError(err)
		delete(todoDecode.ID)
	case http.MethodPut:
		err := json.NewDecoder(r.Body).Decode(&todoDecode)
		checkDecodeError(err)
		update(todoDecode.ID, todoDecode.Name, todoDecode.Todo)
	}
}

func checkDecodeError(err error){
	if err != nil{
		log.Println(err)
	}
}

func getDB() {
	rows, err := db.Query("SELECT * FROM todo")
	defer rows.Close()
	if err != nil {
		log.Println(err)
		return
	}

	// 仮のリスト
	var todoListTmp TodoList
	// TODO ↑のarrayから↓のSlicesに変更
	// todoListTmp := []TodoList{}
	for rows.Next() {
		var id int
		var name string
		var todo string
		if err := rows.Scan(&id, &name, &todo); err != nil {
			log.Println(err)
			return
		}
		// Todo型の変数todoTmpに取得した情報を代入
		todoTmp := Todo{
			ID:   id,
			Name: name,
			Todo: todo,
		}
		// 配列todoListに要素を追加
		todoListTmp = append(todoListTmp, todoTmp)
	}
	// 仮リストの中身を元リストへ代入（appendではない
	todoList = todoListTmp
}

func insert(name string, todo string) {
	ins, err := db.Prepare("INSERT INTO todo(name, todo) VALUES(?,?)")
	if err != nil { // error処理まででひとつのカタマリ
		log.Println(err)
		return
	}
	ins.Exec(name, todo)
}

func delete(id int) {
	del, err := db.Prepare("DELETE FROM todo WHERE id = ?")
	if err != nil {
		log.Println(err)
		return
	}
	del.Exec(id)
}

func update(id int, name string, todo string) {
	upd, err := db.Prepare("UPDATE todo SET name = ?, todo = ? WHERE id = ?")
	if err != nil {
		log.Println(err)
		return
	}
	upd.Exec(name, todo, id)
}
