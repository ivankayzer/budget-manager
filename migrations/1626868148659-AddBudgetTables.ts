import {MigrationInterface, QueryRunner} from "typeorm";

export class AddBudgetTables1626868148659 implements MigrationInterface {
    name = 'AddBudgetTables1626868148659'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `budget_scheduler` (`id` int NOT NULL AUTO_INCREMENT, `userId` varchar(255) NOT NULL, `start` date NOT NULL, `end` date NOT NULL, `amount` int NOT NULL, `rollover` tinyint NOT NULL, `repeat` varchar(255) NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `budget` (`id` int NOT NULL AUTO_INCREMENT, `userId` varchar(255) NOT NULL, `start` date NOT NULL, `end` date NOT NULL, `amount` int NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `schedulerId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `budget_scheduler_categories_category` (`budgetSchedulerId` int NOT NULL, `categoryId` int NOT NULL, INDEX `IDX_304d78d6d5f63aca0a936bb69c` (`budgetSchedulerId`), INDEX `IDX_a12a95a5358fb3d07e1158e180` (`categoryId`), PRIMARY KEY (`budgetSchedulerId`, `categoryId`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `budget_categories_category` (`budgetId` int NOT NULL, `categoryId` int NOT NULL, INDEX `IDX_c4599d73597f4520e730e0fa94` (`budgetId`), INDEX `IDX_eec88a6266701e0c2e291adb49` (`categoryId`), PRIMARY KEY (`budgetId`, `categoryId`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `budget` ADD CONSTRAINT `FK_ee5498ac0f890697d1f081e7911` FOREIGN KEY (`schedulerId`) REFERENCES `budget_scheduler`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `budget_scheduler_categories_category` ADD CONSTRAINT `FK_304d78d6d5f63aca0a936bb69c5` FOREIGN KEY (`budgetSchedulerId`) REFERENCES `budget_scheduler`(`id`) ON DELETE CASCADE ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `budget_scheduler_categories_category` ADD CONSTRAINT `FK_a12a95a5358fb3d07e1158e1800` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `budget_categories_category` ADD CONSTRAINT `FK_c4599d73597f4520e730e0fa941` FOREIGN KEY (`budgetId`) REFERENCES `budget`(`id`) ON DELETE CASCADE ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `budget_categories_category` ADD CONSTRAINT `FK_eec88a6266701e0c2e291adb491` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `budget_scheduler` CHANGE `rollover` `rollover` tinyint NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `budget_scheduler` DROP COLUMN `end`");
        await queryRunner.query("ALTER TABLE `budget_scheduler` CHANGE `repeat` `repeat` varchar(255) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `budget_scheduler` CHANGE `repeat` `repeat` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `budget_scheduler` ADD `end` date NOT NULL");
        await queryRunner.query("ALTER TABLE `budget_scheduler` CHANGE `rollover` `rollover` tinyint NOT NULL");
        await queryRunner.query("ALTER TABLE `budget_categories_category` DROP FOREIGN KEY `FK_eec88a6266701e0c2e291adb491`");
        await queryRunner.query("ALTER TABLE `budget_categories_category` DROP FOREIGN KEY `FK_c4599d73597f4520e730e0fa941`");
        await queryRunner.query("ALTER TABLE `budget_scheduler_categories_category` DROP FOREIGN KEY `FK_a12a95a5358fb3d07e1158e1800`");
        await queryRunner.query("ALTER TABLE `budget_scheduler_categories_category` DROP FOREIGN KEY `FK_304d78d6d5f63aca0a936bb69c5`");
        await queryRunner.query("ALTER TABLE `budget` DROP FOREIGN KEY `FK_ee5498ac0f890697d1f081e7911`");
        await queryRunner.query("DROP INDEX `IDX_eec88a6266701e0c2e291adb49` ON `budget_categories_category`");
        await queryRunner.query("DROP INDEX `IDX_c4599d73597f4520e730e0fa94` ON `budget_categories_category`");
        await queryRunner.query("DROP TABLE `budget_categories_category`");
        await queryRunner.query("DROP INDEX `IDX_a12a95a5358fb3d07e1158e180` ON `budget_scheduler_categories_category`");
        await queryRunner.query("DROP INDEX `IDX_304d78d6d5f63aca0a936bb69c` ON `budget_scheduler_categories_category`");
        await queryRunner.query("DROP TABLE `budget_scheduler_categories_category`");
        await queryRunner.query("DROP TABLE `budget`");
        await queryRunner.query("DROP TABLE `budget_scheduler`");
    }

}
