package main

import (
	"fmt"
	"database/sql"
//	"time"

	_ "github.com/go-sql-driver/mysql"
)
func main() {
	fmt.Println("Hello")

//	db, err:=sql.Open("mysql", "root:1234@tcp(host:3306)/localhost")
//	db, err:=sql.Open("mysql", "root:@tcp(host:3306)/go")
//	db, err:=sql.Open("mysql", "root:1234@tcp(host:3306)/go") tcp host -> 数値に
	db, err:=sql.Open("mysql", "root:1234@tcp(127.0.0.1:3306)/go") //これでOK

	if err != nil {
		panic(err.Error())
	}
	defer db.Close() //defer:延期する

	rows, err:= db.Query("SELECT * FROM todo")
	defer rows.Close()
	if err != nil {
		panic(err.Error())
	}

	for rows.Next(){
		var id int
		var  name string
		var todo string
		if err := rows.Scan(&id, &name, &todo); err != nil{
			panic(err.Error())
		}
		fmt.Println(id, name, todo)
	}








/*
	//構造体を作ってデータを管理
	type Todos struct{
		ID int
		Name string
		Todo string
	}
	*/
}

//関数に分けるとdbの接続が切れる
func insert(name string, todo string){
	fmt.Println("insert")
	fmt.Println(name, todo)
	ins, err := db.Prepare("INSERT INTO todo(name, todo) VALUES(?,?)")
	if err != nil {
		panic(err.Error())
	}
	ins.Exec(name, todo)
}

func delete(row int){
	fmt.Println("delete")
	del, err := db.Prepare("DELETE FROM todo WHERE id = ?")
	if err != nil {
		panic(err.Error())
	}
	del.Exec(row)
}

func update(name string, todo string, id int){
	// UPDATEの書き方はこれでOK(upAdteになってた)
	fmt.Println("UPDATE")
	//result, err := db.Exec("UPADTE todo SET name = ?, todo = ? WHERE id = ?", "nji", "tooodoooooo", 1)
	upd, err := db.Prepare("UPDATE todo SET name = ?, todo = ? WHERE id = ?")
	if err != nil {
		panic(err.Error())
	}
	upd.Exec(name, todo, id)
}