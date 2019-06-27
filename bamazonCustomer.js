//packages needed to be installed
var inquirer = require('inquirer');
var mysql = require('mysql');
var wallet = 100.0;
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
    // displayStore();
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
          setTimeout(buy,500);
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
            message: "Type in the ID number of an item",
		},
		{
			type: "input",
			name: "quantity",
			message: "Type in a quantity for the item",
        }
    ]).then(function(order) {
        var id = order.selection;
        var quantity = order.quantity;
        connection.query("SELECT * FROM store", function(err, response) {
            var product = response[id - 1];
            //console.log(product);
            var inventory = product.stock;
            var total = product.price * quantity;
            var luck = Math.floor((Math.random() * 10) + 1);
            console.log("You have selected " + quantity + " " + product.item + "(s) for a total cost of $" + total);
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
                    //also checks if you have enough money
                    //if yes, then the purchased stock is deducted and the new stock is updated
                    //if not, it sends you back to the buying phase
                    if (inventory < quantity) {
                        console.log("😕: Sorry, Stranger. Don't have enough of that on stock.");
                        displayStore();
                    } else if (total > wallet) {
                        console.log("😕: Damn, Stranger. Seems you're short on funds.");
                        displayStore();
                    } else {
                      updateDb(product, quantity, id, total);
                        
                    }
                } else if(answer.checkout.toUpperCase() === "ASK FOR DISCOUNT") {
                    if (luck >= 7) {
                        console.log("🤔:Alright, alright. For you, I'll make an exeption.")
                        total = (total * 0.5);
                        if (inventory < quantity) {
                            console.log("😕: Sorry, Stranger. Don't have enough of that on stock.");
                            displayStore();
                        } else if (total > wallet) {
                            console.log("😕: Damn, Stranger. Seems you're short on funds.");
                            displayStore();
                        } else {
                            updateDb(product,quantity,id,total);
                        }
                    } else if (luck > 2) {
                        console.log("😑: No can do. I'm trying to run a business here! Try again.")
                        displayStore();
                        buy();
                    } else {
                        console.log("😤: How dare you! This is a fine establishment, not some street market! I think it's best y'all leave now.");
                        console.log("You got kicked out of the store!");
                        connection.end();
                    }
                } else if (answer.checkout.toUpperCase() === "TRY TO STEAL") {
                     if (luck > 5) {
                      connection.query(
                            "UPDATE store SET ? WHERE ?",
                             [
                               {
                                 stock: inventory - quantity
                              },
                              {
                                id: id
                              }
                            ],
                              function(error) {
                              if (error) throw err;
                              console.log("You got away with it!");
                              displayStore();
                            }
                            );
                     } else {
                         console.log("🔫😡: Hands up, Buddy! Nobody steals from my store!")
                         console.log("You ran out of there as fast as possible");
                         connection.end();
                     }
                } else {
                    console.log("😕: Feeling indecisive today, are we?");
                    displayStore();
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
        console.log("Wallet: $" + wallet +"\n");

	  	start();
	})
}

function updateDb(product, purchasedStock, id, total){
  connection.query(
    "UPDATE store SET ? WHERE ?",
    [
      {
        stock: product.stock - purchasedStock
      },
      {
        id: id
      }
    ],
    function(error) {
      if (error) throw err;
      console.log("🤠:Pleasure doin' business with ya!");
      wallet -= (total);
      displayStore();
    }
  );
}

console.log("🤠:Howdy! My Name is Slippery Sam! Welcome to my general store!");

displayStore();
// start()


        
