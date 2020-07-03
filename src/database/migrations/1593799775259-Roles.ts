import { MigrationInterface, QueryRunner } from 'typeorm';

import { Role, RoleSlug } from '~/roles/entities';

export class Roles1593799775259 implements MigrationInterface {
  name = 'Roles1593799775259';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "slug" character varying(10) NOT NULL,
      "name" character varying(10) NOT NULL,
      "description" character varying(50),
      "created_at" TIMESTAMP NOT NULL DEFAULT now(),
      "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
      CONSTRAINT "UQ_881f72bac969d9a00a1a29e1079" UNIQUE ("slug"),
      CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"),
      CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );

    await queryRunner.manager.insert(Role, [
      {
        slug: RoleSlug.USER,
        name: 'User',
        description: 'Default system user',
      },
      {
        slug: RoleSlug.ADMIN,
        name: 'Admin',
        description: 'System administrator user',
      },
    ]);

    await queryRunner.query(
      `CREATE TABLE "role_user" ("user_id" uuid NOT NULL,
      "role_id" uuid NOT NULL,
      "created_at" TIMESTAMP NOT NULL DEFAULT now(),
      "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
      CONSTRAINT "PK_0d02ac0493a7a8193048bbc7da5"
      PRIMARY KEY ("user_id", "role_id"))`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_5261e26da61ccaf8aeda8bca8e" ON "role_user" ("user_id") `,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_78ee37f2db349d230d502b1c7e" ON "role_user" ("role_id") `,
    );

    await queryRunner.query(
      `ALTER TABLE "role_user" ADD CONSTRAINT "FK_5261e26da61ccaf8aeda8bca8ea"
      FOREIGN KEY ("user_id") REFERENCES "users"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "role_user" ADD CONSTRAINT "FK_78ee37f2db349d230d502b1c7ea"
      FOREIGN KEY ("role_id") REFERENCES "roles"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role_user" DROP CONSTRAINT "FK_78ee37f2db349d230d502b1c7ea"`,
    );

    await queryRunner.query(
      `ALTER TABLE "role_user" DROP CONSTRAINT "FK_5261e26da61ccaf8aeda8bca8ea"`,
    );

    await queryRunner.query(`DROP INDEX "IDX_78ee37f2db349d230d502b1c7e"`);

    await queryRunner.query(`DROP INDEX "IDX_5261e26da61ccaf8aeda8bca8e"`);

    await queryRunner.query(`DROP TABLE "role_user"`);

    await queryRunner.query(`DROP TABLE "roles"`);
  }
}
