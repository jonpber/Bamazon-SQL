var inquirer = require ("inquirer");
var chalk = require ("chalk");

var figlet = require("figlet");

var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '******', //Local password commented out.
  database : 'bamazon'
});

figlet("Bamazon", function(err, data){
	if (err) {
		return console.log(err);
	} 

	console.log(data);
	managerPrompt();
});


function managerPrompt(){
	inquirer.prompt([
	{
		name: "managerChoices",
		message: "Hello manager. Please select your option.",
		type: "list",
		choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"]
	}	
	]).then(function(answer){
		if (answer.managerChoices === "View Products for Sale"){
			connection.query('SELECT * from products', function (error, results) {
  			if (error) throw error;
  				console.log("-----------------");
				console.log("Items for sale are:")
				for (var i = 0; i < results.length; i++){
					console.log(results[i].item_id + ". Name: " + results[i].product_name + " -- Price: $" + results[i].price + " -- Stock: " + results[i].stock_quantity);
				}
				console.log("-----------------");
  			})
  			setTimeout(managerPrompt, 1500);
		}

		else if (answer.managerChoices === "View Low Inventory"){
			connection.query('SELECT * from products', function (error, results) {
  			if (error) throw error;
  				console.log("-----------------");
				console.log("Items with low quantity:")
				for (var i = 0; i < results.length; i++){
					if (results[i].stock_quantity < 5){
						console.log(results[i].item_id + ". Name: " + results[i].product_name + " -- Price: $" + results[i].price + " -- Stock: " + results[i].stock_quantity);
					}
				}
				console.log("-----------------");
  			})
  			setTimeout(managerPrompt, 1500);
		}

		else if (answer.managerChoices === "Add to Inventory"){
			connection.query('SELECT * from products', function (error, results) {
  			if (error) throw error;
  				console.log("-----------------");
				console.log("Items in Store:")
				for (var i = 0; i < results.length; i++){
					console.log(results[i].item_id + ". Name: " + results[i].product_name + " -- Price: $" + results[i].price + " -- Stock: " + results[i].stock_quantity);
				}
				console.log("-----------------");
				
				inquirer.prompt([
					{
						name: "itemID",
						message: "Please give the id of the item to update: "
					},

					{
						name: "itemQuantity",
						message: "Please give the number to increase item stock by: "
					}
					]).then(function(answers1){
						var sql = "UPDATE products SET stock_quantity = " + JSON.stringify(results[parseInt(answers1.itemID) - 1].stock_quantity + parseInt(answers1.itemQuantity)) + " WHERE item_id = " + answers1.itemID;
			  			connection.query(sql, function (error, resul1) {
			 				if (error) throw error;
			 			});

			 			console.log("Item stock updated!");
			 			setTimeout(managerPrompt, 1500);
					});
  			});
		}

		else if (answer.managerChoices === "Add New Product"){
			connection.query('SELECT * from products', function (error, results) {
	  			if (error) throw error;
	  				console.log("-----------------");
					console.log("Items in Store:")
					for (var i = 0; i < results.length; i++){
						console.log(results[i].item_id + ". Name: " + results[i].product_name + " -- Price: $" + results[i].price + " -- Stock: " + results[i].stock_quantity);
					}
					console.log("-----------------");
					
					inquirer.prompt([
						{
							name: "itemName",
							message: "Please give the NAME of the product to add: "
						},

						{
							name: "itemDepartment",
							message: "Please give the DEPARTMENT the product would belong to: "
						},

						{
							name: "itemPrice",
							message: "Please give the PRICE of the product: "
						},

						{
							name: "itemQuantity",
							message: "Please give the STOCK QUANTITY of the product: "
						},
						]).then(function(answers1){
							var sql = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('" 
							+ answers1.itemName +  "', '" + answers1.itemDepartment + "', '" 
							+ answers1.itemPrice + "', '" + answers1.itemQuantity + "')"; 
				  			connection.query(sql, function (error, resul1) {
				 				if (error) throw error;
				 			});

				 			console.log("Item added to Bamazon listings!");
				 			setTimeout(managerPrompt, 1500);
						})
	  		})
		}

		else {
			connection.end();
		}

	});
}
