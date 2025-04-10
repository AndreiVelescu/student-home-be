-- CreateTable
CREATE TABLE `CaminRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `aplicantName` VARCHAR(191) NOT NULL,
    `applicantFirstName` VARCHAR(191) NOT NULL,
    `applicantEmail` VARCHAR(191) NOT NULL,
    `applicantPhone` VARCHAR(191) NOT NULL,
    `applicantAddress` VARCHAR(191) NOT NULL,
    `applicantCity` VARCHAR(191) NOT NULL,
    `applicantState` VARCHAR(191) NOT NULL,
    `applicantUniversity` VARCHAR(191) NOT NULL,
    `applicantDormitoryPreference` VARCHAR(191) NOT NULL,
    `buletinFrontUrl` VARCHAR(191) NOT NULL,
    `buletinBackUrl` VARCHAR(191) NOT NULL,
    `confirmareStudiiUrl` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CaminRequest` ADD CONSTRAINT `CaminRequest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
