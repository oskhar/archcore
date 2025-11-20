package repository

import (
	"context"
	"database/sql"
	"github.com/doug-martin/goqu/v9"
	"github.com/oskhar/go-rest/domain"
)

type customerRepository struct {
	db *goqu.Database
}

func NewCustomer(con *sql.DB) domain.CustomerRepository {
	return &customerRepository{
		db: goqu.New("postgres", con),
	}
}

func (c *customerRepository) FindAll(ctx context.Context) (result []domain.Customer, err error) {
	dataset := c.db.From("customers").Where(goqu.C("deleted_at").IsNull())
	err = dataset.ScanStructsContext(ctx, result)

	return
}

func (c *customerRepository) FindById(ctx context.Context, id int) (result domain.Customer, err error) {
	dataset := c.db.From("customers").Where(goqu.C("deleted_at").IsNull()).Where(goqu.C("id").Eq(id))
	err = dataset.ScanStructsContext(ctx, &result)

	return
}
