//packages needed to be installed
var inquirer = require('inquirer');
var mysql = require('mysql');

//connect to store database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "BamazonDB"
  });

//function which starts the shopping program
  function start() {
    inquirer
      .prompt({
        name: "buyOrSell",
        type: "list",
        message: "What can I do for you, Stranger?",
        choices: ["BUY", "LEAVE"]
      })
      .then(function(answer) {
        if (answer.buyOrSell.toUpperCase() === "BUY") {
          //choosing buy will display store inventory and then activate buy function
          console.log("🤠:Itchin' to shop? Well then you've come to the right place!")  
          displayStore();
          buy();
        } else {
            //the program ends if you select to leave
            console.log("🤠:Happy trails, compadre!")
            connection.end();
        }
      });
  }

  function buy() {
    //this first inquirer prompt asks the user to place an order
    inquirer.prompt([
		{
			type: "input",
			name: "selection",
            message: "Type in the ID number of an item\n",
		},
		{
			type: "input",
			name: "quantity",
			message: "Type in a quantity for the item",
        }
    ]).then(function(order) {
        var id = order.selection;
        var quantity = order.quantity;
        connection.query("SELECT * FROM products", function(err, response) {
            var product = response[id - 1];
            var total = product.price * quantity;
            console.log("You have selected " + quantity + " " + product + "(s) for a total cost of $" + total);
            if (err) throw err;
            //second inquirer asks the user how he wants to proceed with the order
            inquirer.prompt({
                name: "checkout",
                type: "list",
                message: "What will you do next?",
                choices: ["CONFIRM PURCHASE", "ASK FOR DISCOUNT", "TRY TO STEAL", "CANCEL ORDER"]
            })
            .then(function(answer) {
                if (answer.checkout.toUpperCase() === "CONFIRM PURCHASE") {
                    //if you confirm purchase the code checks whether or not the desired item has enough stock
                    //if yes, then the purchased stock is deducted and the new stock is updated
                    //if not, it sends you back to the buying phase
                    if (product.stock >= quantity) {
                        connection.query(
                            "UPDATE auctions SET ? WHERE ?",
                            [
                              {
                                stock: quantity
                              }
                            ],
                            function(error) {
                              if (error) throw err;
                              console.log("🤠:Pleasure doin' business with ya!");
                              start();
                            }
                          );
                    } else {
                        console.log("😕: Sorry, Stranger. Don't have enough of that on stock.");
                        start();
                    }
                } else if(answer.checkout.toUpperCase() === "ASK FOR DISCOUNT") {
                    
                } else if (answer.checkout.toUpperCase() === "TRY TO STEAL") {
                     
                } else {
                    console.log("😕: Feeling indecisive today, are we?");
                    start();
                }
            });
        });
	})
  }

  function displayStore() {
	query = 'SELECT * FROM store';
	connection.query(query, function(err, response) {
        if (err) throw err;
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
		console.log("Slippery Sam's Rootin' Tootin' General Store");
		console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

		var displayString = "";
		for (var i = 0; i < response.length; i++) {
			displayString = "";
			displayString += "ID: " + response[i].id + "  ||  ";
			displayString+= "Item: " + response[i].item + "  ||  ";
            displayString += "Type: " + response[i].type + "  ||  ";
            displayString += "Price: $" + response[i].price + "  ||  ";
			displayString += "Stock: " + response[i].stock + "\n";

			console.log(displayString);
		}

	  	console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");

	  	;
	})
}

console.log("🤠:Howdy! My Name is Slippery Sam! Welcome to my general store!");

start()


        
