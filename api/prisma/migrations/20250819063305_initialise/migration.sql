-- CreateTable
CREATE TABLE "Chocolate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "UserCash" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "cash" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Chocolate_name_key" ON "Chocolate"("name");
