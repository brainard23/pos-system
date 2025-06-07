# ✅ TASK.md

## 📋 Active Tasks
- [x] Setup MongoDB schema and seed data
- [x] add a controller file for the server
  - Created controllers for products, suppliers, and categories
  - Reorganized server structure to follow MVC pattern
  - Added validation middleware
  - Separated business logic from routes
  - Added proper error handling and type safety
- [x] Enhance Products.tsx component content should be transfered in pages folder
  - Moved Products component to pages folder
  - Created reusable form components
  - Implemented custom hooks for API calls
  - Separated types into their own files
  - Improved code organization and maintainability
- [x] add a dashboard page. this page contain sales, inventory, and other important KPI
- [x] add a transaction page UI
- [x] make the transaction backend and wire it. there are 3 types of payment method 1 is cash, 2 is card, and 3 credit card.
  - Created Transaction model with payment method support
  - Implemented transaction controller with CRUD operations
  - Added routes with validation and authentication
  - Integrated with server and error handling
  - Added stock management and transaction statistics
- [ ] Enhance the Api calls in the Product page apply our rules in api calling
- [ ] setup unit test use Jest
- [ ] Enhance Products.tsx, remove repetitive components and make it reusable
- [ ] Only call fetch api for supplier and catigory when creating a product
- [ ] create custom hooks 
- [ ] create a transaction page
- [ ] transaction page is divided into 2 parts products and the transaction
- [ ] in the product part it should display all the product but its categorize and first tab can display All
- [ ] in the transaction part it display all the product purchase
- [ ] the customer can choose to pay in cash, credit card, visa (we dont need to integrate the payment method yet but it should do a transaction by using dummy data for the payment)
- [ ] add a discount or coupon feature 
- [ ] discount or coupon should be applied in transaction
- [ ] Build reusable button and form components

## 🛠 Discovered During Work
- [ ] Add pagination to product list
- [ ] Improve error handling in product service
- [ ] Add loading states for supplier and category forms
- [ ] Implement form validation using a form library (e.g., react-hook-form)
- [ ] Add unit tests for custom hooks
- [ ] Add unit tests for form components

## Unit test
- [ ] do unit test for product, categories and product

## ✅ Completed Tasks
- [x] Setup project scaffolding
- [x] Integrated Tailwind CSS
- [x] Configured Electron with Vite + React
