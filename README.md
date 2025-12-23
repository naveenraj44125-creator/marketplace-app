# Marketplace App

An e-commerce web application where sellers can upload products with images (stored in S3) and buyers can purchase and review products.

## Features

- **User Authentication**: Register as buyer or seller
- **Seller Dashboard**: Upload products with images to S3, manage listings, view sales
- **Product Catalog**: Browse, search, and filter products by category
- **Purchases**: Buy products with order history
- **Reviews**: Rate and review purchased products (purchase required)

## Setup

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Configure Environment
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

Required environment variables:
- `JWT_SECRET` - Secret key for JWT tokens
- `AWS_REGION` - Your AWS region (e.g., us-east-1)
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `S3_BUCKET_NAME` - S3 bucket name for product images

### 3. S3 Bucket Setup
Create an S3 bucket with CORS configuration:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "GET"],
    "AllowedOrigins": ["http://localhost:5173"],
    "ExposeHeaders": []
  }
]
```

### 4. Run the App
```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Usage

1. Register as a **seller** to list products
2. Register as a **buyer** to purchase and review
3. Sellers can upload product images, set prices, and manage inventory
4. Buyers can browse, purchase, and leave reviews on purchased items
