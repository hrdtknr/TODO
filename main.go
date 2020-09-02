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

	fmt.Println("-----一覧表示-----")
	read()
	fmt.Println("\n----------\n")

	//処理決定
	var input int
	fmt.Println("挿入: 1\n削除: 2\n更新: 3\n")
	fmt.Scan(&input)

	switch(input) {
		case 1:
			fmt.Printf("入力: %d 処理: 挿入\n",input)
			fmt.Println("\n----------\n")
			var name string
			var todo string
			fmt.Print("名前を入力：")
			fmt.Scan(&name)
			fmt.Print("TODOを入力：")
			fmt.Scan(&todo)
			insert(name, todo)
		case 2:
			fmt.Printf("入力: %d 処理: 削除\n",input)
			fmt.Println("\n----------\n")
			var id int
			fmt.Print("削除行を入力：")
			fmt.Scan(&id)
			delete(id)
		case 3:
			fmt.Printf("入力: %d 処理: 更新\n",input)
			fmt.Println("\n----------\n")
			var name string
			var todo string
			var id int
			fmt.Print("更新idを入力：")
			fmt.Scan(&id)
			fmt.Print("名前を入力：")
			fmt.Scan(&name)
			fmt.Print("TODOを入力：")
			fmt.Scan(&todo)
			update(name, todo, id)
		default:
			fmt.Println("該当しない処理です")
	}

	fmt.Println("\n-----処理結果-----\n")
	read()






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
//後で修正するとして、各関数に接続処理を挿入


func insert(name string, todo string){
	//fmt.Println("insert")
	//fmt.Println(name, todo)

	//open
	db, err:=sql.Open("mysql", "root:1234@tcp(127.0.0.1:3306)/go") //これでOK

	if err != nil {
		panic(err.Error())
	}
	defer db.Close() //defer:延期する

	// insert
	ins, err := db.Prepare("INSERT INTO todo(name, todo) VALUES(?,?)")
	if err != nil {
		panic(err.Error())
	}
	ins.Exec(name, todo)
}

func delete(id int){
	//fmt.Println("delete")

	//open
	db, err:=sql.Open("mysql", "root:1234@tcp(127.0.0.1:3306)/go") //これでOK

	if err != nil {
		panic(err.Error())
	}
	defer db.Close() //defer:延期する

	//delete
	del, err := db.Prepare("DELETE FROM todo WHERE id = ?")
	if err != nil {
		panic(err.Error())
	}
	del.Exec(id)
}

func update(name string, todo string, id int){
	// UPDATEの書き方はこれでOK(upAdteになってた)
	//fmt.Println("UPDATE")

	//open
	db, err:=sql.Open("mysql", "root:1234@tcp(127.0.0.1:3306)/go") //これでOK

	if err != nil {
		panic(err.Error())
	}
	defer db.Close() //defer:延期する

	//update
	upd, err := db.Prepare("UPDATE todo SET name = ?, todo = ? WHERE id = ?")
	if err != nil {
		panic(err.Error())
	}
	upd.Exec(name, todo, id)
}

func read(){
	//open
	db, err:=sql.Open("mysql", "root:1234@tcp(127.0.0.1:3306)/go") //これでOK

	if err != nil {
		panic(err.Error())
	}
	defer db.Close() //defer:延期する

	//read
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
}

