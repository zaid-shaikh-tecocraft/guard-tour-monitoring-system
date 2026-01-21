-- CreateTable
CREATE TABLE `GuardAttendanceAssignment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guardId` INTEGER NOT NULL,
    `attendancePointId` INTEGER NOT NULL,
    `orgId` INTEGER NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `startDate` DATETIME(3) NULL,
    `endDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `GuardAttendanceAssignment_orgId_isActive_idx`(`orgId`, `isActive`),
    INDEX `GuardAttendanceAssignment_guardId_isActive_idx`(`guardId`, `isActive`),
    INDEX `GuardAttendanceAssignment_attendancePointId_isActive_idx`(`attendancePointId`, `isActive`),
    UNIQUE INDEX `GuardAttendanceAssignment_guardId_attendancePointId_key`(`guardId`, `attendancePointId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuardPatrolAssignment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guardId` INTEGER NOT NULL,
    `patrolPointId` INTEGER NOT NULL,
    `orgId` INTEGER NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `startDate` DATETIME(3) NULL,
    `endDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `GuardPatrolAssignment_orgId_isActive_idx`(`orgId`, `isActive`),
    INDEX `GuardPatrolAssignment_guardId_isActive_idx`(`guardId`, `isActive`),
    INDEX `GuardPatrolAssignment_patrolPointId_isActive_idx`(`patrolPointId`, `isActive`),
    UNIQUE INDEX `GuardPatrolAssignment_guardId_patrolPointId_key`(`guardId`, `patrolPointId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GuardAttendanceAssignment` ADD CONSTRAINT `GuardAttendanceAssignment_guardId_fkey` FOREIGN KEY (`guardId`) REFERENCES `Guard`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuardAttendanceAssignment` ADD CONSTRAINT `GuardAttendanceAssignment_attendancePointId_fkey` FOREIGN KEY (`attendancePointId`) REFERENCES `AttendancePoint`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuardAttendanceAssignment` ADD CONSTRAINT `GuardAttendanceAssignment_orgId_fkey` FOREIGN KEY (`orgId`) REFERENCES `Organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuardPatrolAssignment` ADD CONSTRAINT `GuardPatrolAssignment_guardId_fkey` FOREIGN KEY (`guardId`) REFERENCES `Guard`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuardPatrolAssignment` ADD CONSTRAINT `GuardPatrolAssignment_patrolPointId_fkey` FOREIGN KEY (`patrolPointId`) REFERENCES `PatrolPoint`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuardPatrolAssignment` ADD CONSTRAINT `GuardPatrolAssignment_orgId_fkey` FOREIGN KEY (`orgId`) REFERENCES `Organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
