import {MigrationInterface, QueryRunner} from "typeorm";

export class MakeDescriptionFieldNullable1626599602687 implements MigrationInterface {
    name = 'MakeDescriptionFieldNullable1626599602687'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `transaction` CHANGE `description` `description` varchar(255) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `transaction` CHANGE `description` `description` varchar(255) NOT NULL");
    }

}
