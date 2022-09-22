/*
  Warnings:

  - Added the required column `name` to the `orders_products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders_products" ADD COLUMN     "name" TEXT NOT NULL;
