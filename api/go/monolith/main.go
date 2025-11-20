package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/oskhar/go-rest/internal/config"
	"github.com/oskhar/go-rest/internal/connection"
	"github.com/oskhar/go-rest/internal/repository"
	"log"
)

func main() {
	app := fiber.New()
	app.Use(recover.New())
	app.Use(logger.New())

	cnf := config.Get()
	db := connection.GetDatabse(cnf.Database)

	customerRepository := repository.NewCustomer(db)

	app.Get("/developers", developers)

	log.Fatal(app.Listen(cnf.Server.Host + ":" + cnf.Server.Port))
}

func developers(c *fiber.Ctx) error {
	return c.Status(200).JSON(map[string]string{"message": "Hello World"})
}
