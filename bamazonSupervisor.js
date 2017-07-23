var inquirer = require ("inquirer");
var chalk = require ("chalk");
const {table} = require('table');
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
	supervisorPrompt();
});

function supervisorPrompt(){
	inquirer.prompt([
	{
		message: "Welcome Supervisor. What would you like to do?",
		type: "list",
		name: "superChoices",
		choices: ["View Product Sales by Department", "Create New Department", "Quit"]
	}
		]).then(function(answers){
			if(answers.superChoices === "View Product Sales by Department"){
				var sql = "SELECT departments.department_id as ID, departments.department_name as Department, " 
				+ "departments.over_head_costs as Over_Head_Costs, sum(products.product_sales) as Product_Sales, "
				+ "(sum(products.product_sales) - departments.over_head_costs) as total_profit FROM products RIGHT JOIN "
				+ "departments ON products.department_name=departments.department_name group by departments.department_name "
				+ "order by (departments.department_id) asc";
	  			connection.query(sql, function (error, resul1, fields) {
	 				if (error) throw error;

	 				var fieldRow = [];

	 				for (var i = 0; i < fields.length; i++){
	 					fieldRow.push(fields[i].name);
	 				}

	 				var data = [];
	 				data.push(fieldRow);

	 				for (var i = 0; i < resul1.length; i++){
		 				var row = [resul1[i].ID, resul1[i].Department, resul1[i].Over_Head_Costs, resul1[i].Product_Sales, resul1[i].total_profit];
		 				if (resul1[i].Product_Sales === null){
		 					row[3] = "No products listed";
		 					row[4] = "No products listed";
		 				}

		 				else {
		 					row[3] = row[3];
		 					row[4] = row[4];
		 				}
		 				data.push(row);
	 				}

	 				var output = table(data);

					console.log(output);
					supervisorPrompt();
	 			});
			}

			else if (answers.superChoices === "Create New Department"){
				inquirer.prompt([
				{
					message: "Please enter the department name: ",
					name: "newDept"
				},

				{
					message: "Please enter the department overhead cost: ",
					name: "newDeptoverhead"
				}
					]).then(function(answers2){
			  			connection.query("INSERT INTO departments (department_name, over_head_costs) VALUES (?, ?)", [
			  				answers2.newDept,
			  				answers2.newDeptoverhead
			  				], function (error, resul1) {
			 				if (error) throw error;
			 			});
			 			
			 			console.log("New department added.");
			 			supervisorPrompt();
					});
			}

			else {
				connection.end();
			}
		});
}




