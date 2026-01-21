/*
  Warnings:

  - A unique constraint covering the columns `[orgId]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orgId` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Organization` ADD COLUMN `orgId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Organization_orgId_key` ON `Organization`(`orgId`);

-- CreateIndex
CREATE INDEX `Organization_orgId_idx` ON `Organization`(`orgId`);
