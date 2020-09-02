package main

import (
	"fmt"
	"database/sql"

	_ "github.com/go-sql-driver/mysql"
)
func main() {
	fmt.Println("Hello")

//	db, err:=sql.Open("mysql", "root:1234@tcp(host:3306)/localhost")
//	db, err:=sql.Open("mysql", "root:@tcp(host:3306)/go")
	db, err:=sql.Open("mysql", "root:1234@tcp(host:3306)/go")
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

}
