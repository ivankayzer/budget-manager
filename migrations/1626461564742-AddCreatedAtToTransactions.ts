import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCreatedAtToTransactions1626461564742 implements MigrationInterface {
    name = 'AddCreatedAtToTransactions1626461564742'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `transaction` ADD `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `transaction` DROP COLUMN `createdAt`");
    }

}
