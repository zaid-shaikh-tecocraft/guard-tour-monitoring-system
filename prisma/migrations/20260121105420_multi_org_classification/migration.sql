/*
  Warnings:

  - You are about to drop the column `savedAt` on the `RfidRecord` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `RfidRecord` DROP COLUMN `savedAt`;

-- CreateTable
CREATE TABLE `Organization` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Machine` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `machineId` VARCHAR(191) NOT NULL,
    `orgId` INTEGER NOT NULL,
    `name` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Machine_machineId_key`(`machineId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Guard` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rfid` VARCHAR(191) NOT NULL,
    `orgId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Guard_rfid_key`(`rfid`),
    INDEX `Guard_orgId_rfid_idx`(`orgId`, `rfid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AttendancePoint` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rfid` VARCHAR(191) NOT NULL,
    `orgId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `AttendancePoint_rfid_key`(`rfid`),
    INDEX `AttendancePoint_orgId_rfid_idx`(`orgId`, `rfid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PatrolPoint` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rfid` VARCHAR(191) NOT NULL,
    `orgId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PatrolPoint_rfid_key`(`rfid`),
    INDEX `PatrolPoint_orgId_rfid_idx`(`orgId`, `rfid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Authentication` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guardId` INTEGER NOT NULL,
    `machineId` INTEGER NOT NULL,
    `orgId` INTEGER NOT NULL,
    `scannedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Authentication_orgId_scannedAt_idx`(`orgId`, `scannedAt`),
    INDEX `Authentication_guardId_scannedAt_idx`(`guardId`, `scannedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attendance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guardId` INTEGER NOT NULL,
    `attendancePointId` INTEGER NOT NULL,
    `machineId` INTEGER NOT NULL,
    `orgId` INTEGER NOT NULL,
    `scannedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Attendance_orgId_scannedAt_idx`(`orgId`, `scannedAt`),
    INDEX `Attendance_guardId_scannedAt_idx`(`guardId`, `scannedAt`),
    INDEX `Attendance_attendancePointId_scannedAt_idx`(`attendancePointId`, `scannedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Patrol` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guardId` INTEGER NOT NULL,
    `patrolPointId` INTEGER NOT NULL,
    `machineId` INTEGER NOT NULL,
    `orgId` INTEGER NOT NULL,
    `scannedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Patrol_orgId_scannedAt_idx`(`orgId`, `scannedAt`),
    INDEX `Patrol_guardId_scannedAt_idx`(`guardId`, `scannedAt`),
    INDEX `Patrol_patrolPointId_scannedAt_idx`(`patrolPointId`, `scannedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Machine` ADD CONSTRAINT `Machine_orgId_fkey` FOREIGN KEY (`orgId`) REFERENCES `Organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Guard` ADD CONSTRAINT `Guard_orgId_fkey` FOREIGN KEY (`orgId`) REFERENCES `Organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttendancePoint` ADD CONSTRAINT `AttendancePoint_orgId_fkey` FOREIGN KEY (`orgId`) REFERENCES `Organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PatrolPoint` ADD CONSTRAINT `PatrolPoint_orgId_fkey` FOREIGN KEY (`orgId`) REFERENCES `Organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Authentication` ADD CONSTRAINT `Authentication_guardId_fkey` FOREIGN KEY (`guardId`) REFERENCES `Guard`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Authentication` ADD CONSTRAINT `Authentication_machineId_fkey` FOREIGN KEY (`machineId`) REFERENCES `Machine`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Authentication` ADD CONSTRAINT `Authentication_orgId_fkey` FOREIGN KEY (`orgId`) REFERENCES `Organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_guardId_fkey` FOREIGN KEY (`guardId`) REFERENCES `Guard`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_attendancePointId_fkey` FOREIGN KEY (`attendancePointId`) REFERENCES `AttendancePoint`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_machineId_fkey` FOREIGN KEY (`machineId`) REFERENCES `Machine`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_orgId_fkey` FOREIGN KEY (`orgId`) REFERENCES `Organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Patrol` ADD CONSTRAINT `Patrol_guardId_fkey` FOREIGN KEY (`guardId`) REFERENCES `Guard`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Patrol` ADD CONSTRAINT `Patrol_patrolPointId_fkey` FOREIGN KEY (`patrolPointId`) REFERENCES `PatrolPoint`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Patrol` ADD CONSTRAINT `Patrol_machineId_fkey` FOREIGN KEY (`machineId`) REFERENCES `Machine`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Patrol` ADD CONSTRAINT `Patrol_orgId_fkey` FOREIGN KEY (`orgId`) REFERENCES `Organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
