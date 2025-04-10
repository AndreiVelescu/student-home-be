/*
  Warnings:

  - Made the column `userId` on table `CaminRequest` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `CaminRequest` DROP FOREIGN KEY `CaminRequest_userId_fkey`;

-- AlterTable
ALTER TABLE `CaminRequest` MODIFY `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Documents` ADD COLUMN `caminRequestId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `CaminRequest` ADD CONSTRAINT `CaminRequest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Documents` ADD CONSTRAINT `Documents_caminRequestId_fkey` FOREIGN KEY (`caminRequestId`) REFERENCES `CaminRequest`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
