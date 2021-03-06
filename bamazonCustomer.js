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
	customerPrompt();
});
 
function customerPrompt(){
	connection.query('SELECT * from products', function (error, results) {
	  if (error) throw error;
		console.log("-----------------");
		console.log("Items for sale are:")
		for (var i = 0; i < results.length; i++){
			console.log(results[i].item_id + ". " + results[i].product_name + " - $" + results[i].price);
		}
		console.log("-----------------");

	  inquirer.prompt([
	  {
	  	message: "Please give the ID of the product you'd like to buy: ",
	  	name: "itemID"
	  },

	  {
	  	message: "How many would you like to buy?: ",
	  	name: "itemQuantity"
	  }
	  	]).then(function(answers){
	  		if (results[parseInt(answers.itemID) - 1].stock_quantity >= parseInt(answers.itemQuantity)){
	  			console.log("Your total cost is: $" + (results[parseInt(answers.itemID) - 1].price * parseInt(answers.itemQuantity)).toFixed(2));
	  			console.log("Thanks for shopping with Bamazon!");

	  			connection.query("UPDATE products SET ? WHERE ?", [
	  			{
	  				stock_quantity: results[parseInt(answers.itemID) - 1].stock_quantity - parseInt(answers.itemQuantity)
	  			},
	  			{
	  				item_id: answers.itemID
	  			}

	  				], function (error, resul1) {
	 				if (error) throw error;
	 			});

	  			connection.query("UPDATE products SET ? WHERE ?", [
	  			{
	  				product_sales: results[parseInt(answers.itemID) - 1].product_sales + (results[parseInt(answers.itemID) - 1].price * parseInt(answers.itemQuantity))
	  			},
	  			{
	  				item_id: answers.itemID
	  			}

	  				], function (error, resul1) {
	 				if (error) throw error;
	 			});
	  		}
	  		else {
	  			console.log("Insufficient quantity!");
	  		}

	  		inquirer.prompt([
	  		{
	  			message: "Buy another item?",
	  			name: "buyanother",
	  			type: "list",
	  			choices: ["Yes", "No"]
	  		}
	  			]).then(function(answer1){
	  				if (answer1.buyanother === "Yes"){
	  					customerPrompt();
	  				}

	  				else {
	  					connection.end();
	  				}
	  			})

			
	  	})
	});
}