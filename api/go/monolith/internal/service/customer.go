package service

import (
	"context"
	"github.com/oskhar/go-rest/domain"
	"github.com/oskhar/go-rest/dto"
	"time"
)

type customerService struct {
	customerRepository domain.CustomerRepository
}

func NewCustomer(customerRepository domain.CustomerRepository) domain.CustomerService {
	return &customerService{
		customerRepository: customerRepository,
	}
}

func (c *customerService) Index(ctx context.Context) ([]dto.CustomerData, error) {
	customers, err := c.customerRepository.FindAll(ctx)

	if err != nil {
		return nil, err
	}

	var customerData []dto.CustomerData

	for _, customer := range customers {
		var createdAt string
		if customer.CreatedAt.Valid {
			createdAt = customer.CreatedAt.Time.Format(time.RFC3339)
		}

		customerData = append(customerData, dto.CustomerData{
			Id:        customer.Id,
			Code:      customer.Code,
			Name:      customer.Name,
			CreatedAt: createdAt,
		})
	}

	return customerData, nil
}
