import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCategoryRelationToTransactions1626505369021 implements MigrationInterface {
    name = 'AddCategoryRelationToTransactions1626505369021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `transaction` ADD `categoryId` int NULL");
        await queryRunner.query("ALTER TABLE `transaction` ADD CONSTRAINT `FK_d3951864751c5812e70d033978d` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `transaction` DROP FOREIGN KEY `FK_d3951864751c5812e70d033978d`");
        await queryRunner.query("ALTER TABLE `transaction` DROP COLUMN `categoryId`");
    }

}
