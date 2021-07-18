import {MigrationInterface, QueryRunner} from "typeorm";

export class MakeDescriptionNullable1626629042945 implements MigrationInterface {
    name = 'MakeDescriptionNullable1626629042945'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `transaction` CHANGE `description` `description` varchar(255) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `transaction` CHANGE `description` `description` varchar(255) NOT NULL");
    }

}
