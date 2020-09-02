package database

import (
	"fmt"
	"connect"
)

func insert(name string, todo string){
	fmt.Println("insert")
	fmt.Println(name, todo)
	ins, err := db.Prepare("INSERT INTO todo(name, todo) VALUES(?,?)")
	if err != nil {
		panic(err.Error())
	}
	ins.Exec(name, todo)
}