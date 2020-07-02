import { MigrationInterface, QueryRunner } from 'typeorm';

export class Users1593638276294 implements MigrationInterface {
  name = 'Users1593638276294';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
      "firstname" character varying(50) NOT NULL, 
      "lastname" character varying(50) NOT NULL, 
      "email" character varying(60) NOT NULL, 
      "password" character varying(254) NOT NULL, 
      "birthdate" date, 
      "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
      "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
      CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), 
      CONSTRAINT "UQ_450a05c0c4de5b75ac8d34835b9" UNIQUE ("password"), 
      CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
