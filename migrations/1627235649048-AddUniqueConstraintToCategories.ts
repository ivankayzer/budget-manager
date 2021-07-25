import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUniqueConstraintToCategories1627235649048 implements MigrationInterface {
    name = 'AddUniqueConstraintToCategories1627235649048'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE UNIQUE INDEX `IDX_4760fde1380c4d39297a2e1f98` ON `category` (`userId`, `name`)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_4760fde1380c4d39297a2e1f98` ON `category`");
    }

}
