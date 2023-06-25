import { MigrationInterface, QueryRunner } from "typeorm";

export class INIT1687681283914 implements MigrationInterface {
    name = 'INIT1687681283914'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`account\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(30) NOT NULL, \`password\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`post\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`title\` varchar(120) NOT NULL DEFAULT '', \`content\` text NULL, \`posted\` tinyint NOT NULL DEFAULT 0, \`ownerId\` int NOT NULL, \`featured_photos\` json NULL, FULLTEXT INDEX \`IDX_e28aa0c4114146bfb1567bfa9a\` (\`title\`), FULLTEXT INDEX \`IDX_d178da0438977d4e6911acaed3\` (\`content\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`photo\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`file_url\` varchar(255) NOT NULL, \`file\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`title\` varchar(120) NOT NULL DEFAULT '', \`description\` text NULL, \`ownerId\` int NOT NULL, \`posted\` tinyint NOT NULL DEFAULT 0, \`coverId\` int NULL, FULLTEXT INDEX \`IDX_9f16dbbf263b0af0f03637fa7b\` (\`title\`), FULLTEXT INDEX \`IDX_7b7115fda47b20b277b8ca6f89\` (\`description\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`category_photos_photo\` (\`categoryId\` int NOT NULL, \`photoId\` int NOT NULL, INDEX \`IDX_b97f3ebb141e1a778b3b8b7d32\` (\`categoryId\`), INDEX \`IDX_1e56ba761f143efadbacd9c3d6\` (\`photoId\`), PRIMARY KEY (\`categoryId\`, \`photoId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`post\` ADD CONSTRAINT \`FK_4490d00e1925ca046a1f52ddf04\` FOREIGN KEY (\`ownerId\`) REFERENCES \`account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`category\` ADD CONSTRAINT \`FK_ffcf79002e1738147305ea57664\` FOREIGN KEY (\`ownerId\`) REFERENCES \`account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`category\` ADD CONSTRAINT \`FK_da62a9b372a65aef16fc6804d47\` FOREIGN KEY (\`coverId\`) REFERENCES \`photo\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`category_photos_photo\` ADD CONSTRAINT \`FK_b97f3ebb141e1a778b3b8b7d321\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`category_photos_photo\` ADD CONSTRAINT \`FK_1e56ba761f143efadbacd9c3d6b\` FOREIGN KEY (\`photoId\`) REFERENCES \`photo\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`category_photos_photo\` DROP FOREIGN KEY \`FK_1e56ba761f143efadbacd9c3d6b\``);
        await queryRunner.query(`ALTER TABLE \`category_photos_photo\` DROP FOREIGN KEY \`FK_b97f3ebb141e1a778b3b8b7d321\``);
        await queryRunner.query(`ALTER TABLE \`category\` DROP FOREIGN KEY \`FK_da62a9b372a65aef16fc6804d47\``);
        await queryRunner.query(`ALTER TABLE \`category\` DROP FOREIGN KEY \`FK_ffcf79002e1738147305ea57664\``);
        await queryRunner.query(`ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_4490d00e1925ca046a1f52ddf04\``);
        await queryRunner.query(`DROP INDEX \`IDX_1e56ba761f143efadbacd9c3d6\` ON \`category_photos_photo\``);
        await queryRunner.query(`DROP INDEX \`IDX_b97f3ebb141e1a778b3b8b7d32\` ON \`category_photos_photo\``);
        await queryRunner.query(`DROP TABLE \`category_photos_photo\``);
        await queryRunner.query(`DROP INDEX \`IDX_7b7115fda47b20b277b8ca6f89\` ON \`category\``);
        await queryRunner.query(`DROP INDEX \`IDX_9f16dbbf263b0af0f03637fa7b\` ON \`category\``);
        await queryRunner.query(`DROP TABLE \`category\``);
        await queryRunner.query(`DROP TABLE \`photo\``);
        await queryRunner.query(`DROP INDEX \`IDX_d178da0438977d4e6911acaed3\` ON \`post\``);
        await queryRunner.query(`DROP INDEX \`IDX_e28aa0c4114146bfb1567bfa9a\` ON \`post\``);
        await queryRunner.query(`DROP TABLE \`post\``);
        await queryRunner.query(`DROP TABLE \`account\``);
    }

}
