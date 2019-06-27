var inquirer = require('inquirer');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "BamazonDB"
  });

  function startShopping() {
    inquirer.prompt([
		{
			type: 'input',
			name: 'selection',
            message: 'Now which of them here items tickles your fancy? Point me to an ID number and Ill grab it for you',
		},
		{
			type: 'input',
			name: 'quantity',
			message: 'How many of these can I get you, Stranger?',
        }
    ]).then(function(input) {
		var item = input.selection;
		var quantity = input.quantity;
		var query = 'SELECT * FROM products WHERE ?';

		connection.query(query, {selection: item}, function(err, response) {
			if (err) throw err;
			if (data.length === 0) {
				console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
				displayInventory();
			} else {
				var productData = data[0];
				if (quantity <= productData.stock_quantity) {
					console.log('Congratulations, the product you requested is in stock! Placing order!');

					// Construct the updating query string
					var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE item_id = ' + item;
					// console.log('updateQueryStr = ' + updateQueryStr);

					// Update the inventory
					connection.query(updateQueryStr, function(err, data) {
						if (err) throw err;

						console.log('Your oder has been placed! Your total is $' + productData.price * quantity);
						console.log('Thank you for shopping with us!');
						console.log("\n---------------------------------------------------------------------\n");

						// End the database connection
						connection.end();
					})
				} else {
					console.log('Sorry, there is not enough product in stock, your order can not be placed as is.');
					console.log('Please modify your order.');
					console.log("\n---------------------------------------------------------------------\n");

					displayInventory();
				}
			}
		})
	})
  }