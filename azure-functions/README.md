# Azure Functions — Infinity API

## Setup

```bash
cd azure-functions
npm install
```

## Local Development

1. Copy `local.settings.json` and fill in your Azure SQL credentials
2. Install [Azure Functions Core Tools](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local)
3. Run `func start`

## Database Setup

Run `schema.sql` against your Azure SQL Database to create all tables.

## Deploy

```bash
func azure functionapp publish <YOUR_FUNCTION_APP_NAME>
```

## Environment Variables (App Settings)

| Name | Description |
|------|-------------|
| `SQL_SERVER` | Azure SQL server (e.g. `myserver.database.windows.net`) |
| `SQL_DATABASE` | Database name |
| `SQL_USER` | SQL admin username |
| `SQL_PASSWORD` | SQL admin password |

## Endpoints

| Method | Route | Handler |
|--------|-------|---------|
| GET | `/api/products` | List/filter products |
| GET | `/api/products/{id}` | Get product by ID |
| GET | `/api/products/slug/{slug}` | Get product by slug |
| POST | `/api/products` | Create product |
| PUT | `/api/products/{id}` | Update product |
| DELETE | `/api/products/{id}` | Delete product |
| GET | `/api/events` | List/filter events |
| GET | `/api/events/{id}` | Get event by ID |
| GET | `/api/events/slug/{slug}` | Get event by slug |
| POST | `/api/events` | Create event |
| PUT | `/api/events/{id}` | Update event |
| DELETE | `/api/events/{id}` | Delete event |
| GET | `/api/discounts` | List discounts |
| GET | `/api/discounts/code/{code}` | Validate promo code |
| POST | `/api/discounts` | Create discount |
| PUT | `/api/discounts/{id}` | Update discount |
| DELETE | `/api/discounts/{id}` | Delete discount |
| GET | `/api/categories` | List categories |
| GET | `/api/brands` | List brands |
| GET | `/api/brands/{id}` | Get brand |
| GET | `/api/banners` | List banners |
| POST | `/api/banners` | Create banner |
| PUT | `/api/banners/{id}` | Update banner |
| DELETE | `/api/banners/{id}` | Delete banner |
