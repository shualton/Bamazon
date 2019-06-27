DROP DATABASE IF EXISTS BamazonDB;
CREATE DATABASE BamazonDB;
USE BamazonDB;

CREATE TABLE store (
    id INT NOT NULL AUTO_INCREMENT,
	item VARCHAR(50) NOT NULL,
	type VARCHAR(50) NOT NULL,
	price FLOAT(10,1) NOT NULL,
	stock INTEGER(11) NOT NULL,
	PRIMARY KEY (id)
);

INSERT INTO store (item, type, price, stock)
VALUES ("Cowboy Hat", "Clothes", 5.00, 15),
("Rope", "Tool", 2.00, 50),
("Lantern", "Tool", 8.00, 5),
("Gasoline", "Utility", 3.50, 50),
("Gunpowder", "Utility", 4.25, 50),
("Leather Vest", "Clothes", 10.00, 20),
("Leather Gloves", "Clothes", 8.50, 30),
("Bag of Corn Meal", "Food", 0.50, 50),
("Leather Boots", "Clothes", 10.00, 30),
("Steel Spurs", "Tool", 2.15, 15),
("Ground Coffee Beans", "Food", 0.50, 50),
(".44 Revolver", "Weapon", 10.00, 5),
("Revolver Ammunition", "Weapon", 1.00, 100),
("Twin Barrel Shotgun", "Weapon", 10.00, 5),
("Shotgun Shells", "Weapon", 1.00, 100),
("Steel Pickaxe", "Tool", 8.00, 10),
("Can of Beans", "Food", 1.00, 50),
("Steel Spade", "Tool", 8.00, 10),
("Steel Axe", "Tool", 8.00, 10),
("Dried Fruit", "Food", 2.00, 50);



















