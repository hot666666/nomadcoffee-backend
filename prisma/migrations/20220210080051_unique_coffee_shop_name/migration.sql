/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `CoffeeShop` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CoffeeShop_name_key" ON "CoffeeShop"("name");
