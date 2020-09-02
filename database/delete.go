package database

import (
	"fmt"
	"connect"
)

func delete(row int){
	fmt.Println("delete")
	del, err := db.Prepare("DELETE FROM todo WHERE id = ?")
	if err != nil {
		panic(err.Error())
	}
	del.Exec(row)
}