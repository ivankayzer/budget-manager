import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTypeToTransactions1626462083347 implements MigrationInterface {
    name = 'AddTypeToTransactions1626462083347'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `category` ADD `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `transaction` ADD `type` varchar(255) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `transaction` DROP COLUMN `type`");
        await queryRunner.query("ALTER TABLE `category` DROP COLUMN `createdAt`");
    }

}
