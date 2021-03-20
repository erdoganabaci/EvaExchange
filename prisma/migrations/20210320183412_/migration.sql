-- CreateTable
CREATE TABLE "Buyer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "buyerCoin" INTEGER,
    "buyerMoney" INTEGER,
    "buyerDepositMoney" INTEGER,
    "buyerDesiredCoin" INTEGER
);

-- CreateTable
CREATE TABLE "Seller" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sellerCoin" INTEGER,
    "sellerMoney" INTEGER,
    "sellerDepositMoney" INTEGER,
    "sellerDepositCoin" INTEGER,
    "sellerDepositCoinPrice" INTEGER
);

-- CreateTable
CREATE TABLE "coinRate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "coinRate" INTEGER
);
