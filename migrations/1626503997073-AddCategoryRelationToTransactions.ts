import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCategoryRelationToTransactions1626503997073 implements MigrationInterface {
    name = 'AddCategoryRelationToTransactions1626503997073'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `category` DROP COLUMN `createdAt`");
        await queryRunner.query("ALTER TABLE `category` ADD `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `category` DROP COLUMN `createdAt`");
        await queryRunner.query("ALTER TABLE `category` ADD `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
    }

}
