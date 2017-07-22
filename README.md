# Bamazon-SQL
A SQL-based node app that functions like an Amazon style marketplace.

As functionality is based on local instances of a database, below you'll find a walkthrough of how the app works on the three user levels: Customer, Manager, and Supervisor.

## Customer

When using Bamazon, Customers are given the functionality to "Buy" a listed product from Bamazon.

![Bamazon Customer](/images/bamacustomer.gif)

If the quantity they request is available, the purchase will go through and update the quantity of the products database. If there request exceeds the quantity available they will get an error request. 

This functionality primarily relies on the products SQL database, which tracks products, quantity, department, and amount sold of a given product.


## Manager
Managers have the added ability to check on stock of items, add new items, update stock, and check which items have low stock.

![Bamazon Manager1](/images/bamaManager1.gif)

In the image above, the user is now using the manager function, and has the ability to see all items listed (along with their stock quantity) and specifically which items are low in stock. 

![Bamazon Manager1](/images/bamaManager2.gif)

Managers can also update the stock of a given item if the stock is running low.

![Bamazon Manager1](/images/bamaManager3.gif)

Lastly, Managers can also add a new item to the listing and it will immediately be added.


## Supervisor
Supervisors have the capacity to see the overhead costs and sales of all departments. This works by drawing from both the products DB and the departments DB to generate this information.

![Bamazon Manager1](/images/bamaSuper.gif)

Supervisors can also add a new department to Bamazon's database. If no product is listed for this department the table will say so.
