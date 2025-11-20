package domain

import (
	"context"
	"database/sql"
	"github.com/oskhar/go-rest/dto"
)

type Customer struct {
	Id        int          `db:"id"`
	Code      string       `db:"code"`
	Name      string       `db:"name"`
	CreatedAt sql.NullTime `db:"created_at"`
	UpdatedAt sql.NullTime `db:"updated_at"`
	DeletedAt sql.NullTime `db:"deleted_at"`
}

type CustomerRepository interface {
	FindAll(ctx context.Context) ([]Customer, error)
	FindById(ctx context.Context, id int) (Customer, error)
	Create(ctx context.Context, customer Customer) error
	Update(ctx context.Context, customer Customer) error
	Delete(ctx context.Context, id int) error
}

type CustomerService interface {
	Index(ctx context.Context) ([]dto.CustomerData, error)
}
