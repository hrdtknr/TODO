package database

import (
	"fmt"
)

func connect() {
	db, err:=sql.Open("mysql", "root:1234@tcp(127.0.0.1:3306)/go") //これでOK

	if err != nil {
		panic(err.Error())
	}
	defer db.Close() //defer:延期する
}