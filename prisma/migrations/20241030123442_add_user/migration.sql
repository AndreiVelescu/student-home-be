-- AlterTable
ALTER TABLE `User` MODIFY `FirstName` VARCHAR(191) NOT NULL DEFAULT 'Unknown',
    MODIFY `lastName` VARCHAR(191) NOT NULL DEFAULT 'Unknown';
