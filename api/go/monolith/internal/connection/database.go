package connection

import (
	"fmt"
	"github.com/oskhar/go-rest/internal/config"
	"log"

	"database/sql"
	_ "github.com/lib/pq"
)

func GetDatabse(conf config.Database) *sql.DB {
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		conf.Host, conf.Port, conf.User, conf.Pass, conf.Name, conf.Tz)

	db, err := sql.Open("postgres", dsn)

	if err != nil {
		log.Fatal(err)
	}

	return db
}
