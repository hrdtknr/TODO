package database

import (
	"fmt"
	"connect"
)

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