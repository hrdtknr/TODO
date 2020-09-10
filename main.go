package main

import (
	"database/sql"
	"encoding/json"
	_ "github.com/go-sql-driver/mysql"
	"log"
	"net/http"
	"strconv"
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
	db  *sql.DB
	err error
)

func main() {
	db, err = sql.Open("mysql", "root:1234@tcp(127.0.0.1:3306)/go")
	if err != nil {
		log.Println(err)
	}
	defer db.Close()

	// http://localhost:8080/ にアクセスしたとき、ソースの".src"内のhtmlファイルを表示する
	http.Handle("/", http.FileServer(http.Dir("./src")))
	http.HandleFunc("/todoList", handleIndex) // go側でインポート設定する必要があった
	port := "8080"
	log.Printf("listening port %s", port)
	log.Print(http.ListenAndServe(":"+port, nil))
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
		w.Write([]byte(res))
	case http.MethodPost:
		err := json.NewDecoder(r.Body).Decode(&todoDecode)
		checkDecodeError(err)
		if err := insert(todoDecode.Name, todoDecode.Todo); err != nil {
			log.Println(err)
			return
		}
	case http.MethodDelete:
		var id int
		id, _ = strconv.Atoi(r.URL.Query().Get("id"))
		delete(id)
	case http.MethodPut:
		err := json.NewDecoder(r.Body).Decode(&todoDecode)
		checkDecodeError(err)
		update(todoDecode.ID, todoDecode.Name, todoDecode.Todo)
	}
}

func checkDecodeError(err error) {
	if err != nil {
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

	var todoListTmp TodoList
	for rows.Next() {
		var id int
		var name string
		var todo string
		if err := rows.Scan(&id, &name, &todo); err != nil {
			log.Println(err)
			return
		}

		todoTmp := Todo{
			ID:   id,
			Name: name,
			Todo: todo,
		}
		todoListTmp = append(todoListTmp, todoTmp)
	}
	todoList = todoListTmp
}

func insert(name string, todo string) (err error){
	ins, err := db.Prepare("INSERT INTO todo(name, todo) VALUES(?,?)")
	if err != nil { // error処理まででひとつのカタマリ
		log.Println(err)
		return err
	}
	ins.Exec(name, todo)
	return nil
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
