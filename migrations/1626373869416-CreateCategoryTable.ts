import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateCategoryTable1626373869416 implements MigrationInterface {
    name = 'CreateCategoryTable1626373869416'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `category` (`id` int NOT NULL AUTO_INCREMENT, `userId` varchar(255) NOT NULL, `name` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `category`");
    }

}
