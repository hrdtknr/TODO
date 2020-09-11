package main

import (
	"database/sql"
	"encoding/json"
	_ "github.com/go-sql-driver/mysql"
	"log"
	"net/http"
	"strconv"
)

type Todo struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
	Todo string `json:"todo"`
}

type TodoList []Todo

var (
	todoList TodoList
	db       *sql.DB
	err      error
)

func main() {
	db, err = sql.Open("mysql", "root:1234@tcp(127.0.0.1:3306)/go")
	if err != nil {
		log.Println(err)
	}
	defer db.Close()

	http.Handle("/", http.FileServer(http.Dir("./src")))
	http.HandleFunc("/todoList", handleIndex)
	port := "8080"
	log.Printf("listening port %s", port)
	log.Print(http.ListenAndServe(":"+port, nil))
}

func handleIndex(w http.ResponseWriter, r *http.Request) {
	var todoDecode Todo
	switch r.Method {
	case http.MethodGet:
		if err := getTodos(); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		res, err := json.Marshal(todoList)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(res))
	case http.MethodPost:
		if err := json.NewDecoder(r.Body).Decode(&todoDecode); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if err := saveTodo(todoDecode.Name, todoDecode.Todo); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	case http.MethodDelete:
		id, err := strconv.Atoi(r.URL.Query().Get("id"))
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if err := deleteTodo(id); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	case http.MethodPut:
		if err := json.NewDecoder(r.Body).Decode(&todoDecode); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if err := updateTodo(todoDecode.ID, todoDecode.Name, todoDecode.Todo); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func getTodos() (err error) {
	rows, err := db.Query("SELECT * FROM todo")
	defer rows.Close()
	if err != nil {
		log.Println(err)
		return err
	}

	var todoListTmp TodoList
	for rows.Next() {
		var id int
		var name string
		var todo string
		if err := rows.Scan(&id, &name, &todo); err != nil {
			log.Println(err)
			return err
		}

		todoTmp := Todo{
			ID:   id,
			Name: name,
			Todo: todo,
		}
		todoListTmp = append(todoListTmp, todoTmp)
	}
	todoList = todoListTmp
	return nil
}

func saveTodo(name string, todo string) (err error) {
	ins, err := db.Prepare("INSERT INTO todo(name, todo) VALUES(?,?)")
	if err != nil {
		log.Println(err)
		return err
	}
	ins.Exec(name, todo)
	return nil
}

func deleteTodo(id int) (err error) {
	del, err := db.Prepare("DELETE FROM todo WHERE id = ?")
	if err != nil {
		log.Println(err)
		return err
	}
	del.Exec(id)
	return nil
}

func updateTodo(id int, name string, todo string) (err error) {
	upd, err := db.Prepare("UPDATE todo SET name = ?, todo = ? WHERE id = ?")
	if err != nil {
		log.Println(err)
		return err
	}
	upd.Exec(name, todo, id)
	return nil
}
