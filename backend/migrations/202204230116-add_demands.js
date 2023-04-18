const { MigrationInterface, QueryRunner } = require('typeorm');
class add_demands1650644212037 {
  name = 'add_demands1650644212037';
  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "demand" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "creatorId" integer, CONSTRAINT "PK_2e27cd7b3d79c50d197cb0b3924" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "demand_categories_category" ("demandId" integer NOT NULL, "categoryId" integer NOT NULL, CONSTRAINT "PK_0f09809ac1d01156e8ec81c198f" PRIMARY KEY ("demandId", "categoryId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e6e4bcdc3e201cbe1c9872bfef" ON "demand_categories_category" ("demandId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d9a9df83810ff42236f443cd2e" ON "demand_categories_category" ("categoryId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "demand" ADD CONSTRAINT "FK_f31b06b5bfa8bdf4127eede75bb" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "demand_categories_category" ADD CONSTRAINT "FK_e6e4bcdc3e201cbe1c9872bfef9" FOREIGN KEY ("demandId") REFERENCES "demand"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "demand_categories_category" ADD CONSTRAINT "FK_d9a9df83810ff42236f443cd2e7" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "demand"`);
    await queryRunner.query(`DROP TABLE "demand_categories_category"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e6e4bcdc3e201cbe1c9872bfef"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d9a9df83810ff42236f443cd2e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "demand" DROP CONSTRAINT "FK_f31b06b5bfa8bdf4127eede75bb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "demand_categories_category" DROP CONSTRAINT "FK_e6e4bcdc3e201cbe1c9872bfef9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "demand_categories_category" DROP CONSTRAINT "FK_d9a9df83810ff42236f443cd2e7"`,
    );
  }
}

module.exports = add_demands1650644212037;
