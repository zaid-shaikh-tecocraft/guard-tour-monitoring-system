/*
  Warnings:

  - You are about to drop the `Authentication` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Authentication` DROP FOREIGN KEY `Authentication_guardId_fkey`;

-- DropForeignKey
ALTER TABLE `Authentication` DROP FOREIGN KEY `Authentication_machineId_fkey`;

-- DropForeignKey
ALTER TABLE `Authentication` DROP FOREIGN KEY `Authentication_orgId_fkey`;

-- DropTable
DROP TABLE `Authentication`;
