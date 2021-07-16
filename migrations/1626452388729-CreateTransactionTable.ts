import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTransactionTable1626452388729 implements MigrationInterface {
    name = 'CreateTransactionTable1626452388729'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `transaction` (`id` int NOT NULL AUTO_INCREMENT, `userId` varchar(255) NOT NULL, `amount` int NOT NULL, `paidAt` date NOT NULL, `description` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `transaction`");
    }

}
