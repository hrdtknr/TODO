package main

import (
	"fmt"
	"database/sql"

	_ "github.com/go-sql-driver/mysql"
)
func main() {
	fmt.Println("Hello, 世界")
	fmt.Println("aaaaaa")

//	db, err:=sql.Open("mysql", "root:1234@tcp(host:3306)/go")
	db, err:=sql.Open("mysql", "root:@tcp(host:3306)/go")
	if err != nil {
		panic(err.Error())
	}

	fmt.Println("bbbbb")

	defer db.Close() //defer:延期する

	fmt.Println("ccccc")

	rows, err:= db.Query("SELECT * FROM go.todo")

	fmt.Println("ddddd")

	if err != nil {
		panic(err.Error())
	}

	fmt.Println("eeeee")

	columns, err := rows.Columns()
	if err != nil {
		panic(err.Error())
	}

	fmt.Println("fff")

	fmt.Println(columns)

	fmt.Println("ggg")
}

//202009021150

//GitHubから変更

//pullするときにmasterブランチに移動してから？
