const { MigrationInterface, QueryRunner } = require('typeorm');
class rental1648138826789 {
  name = 'rental1648138826789';
  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "rental" ("id" SERIAL NOT NULL, "note" character varying NOT NULL, "status" character varying NOT NULL DEFAULT '', "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "expectedDelivery" TIMESTAMP WITH TIME ZONE, "actualDelivery" TIMESTAMP WITH TIME ZONE, "expectedReturn" TIMESTAMP WITH TIME ZONE, "actualReturn" TIMESTAMP WITH TIME ZONE, "toolId" integer, "initiatorId" integer, "borrowerId" integer, "renterId" integer, CONSTRAINT "PK_a20fc571eb61d5a30d8c16d51e8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental" ADD CONSTRAINT "FK_2c47c15ba0297857bf92f8231ad" FOREIGN KEY ("toolId") REFERENCES "tool"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental" ADD CONSTRAINT "FK_266a0f55eaad9743f3911a8de6e" FOREIGN KEY ("initiatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental" ADD CONSTRAINT "FK_c3ce970fc42de7edbedbd181e4c" FOREIGN KEY ("borrowerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental" ADD CONSTRAINT "FK_02f61ff986f64c2936b89bc879a" FOREIGN KEY ("renterId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "rental"`);
    await queryRunner.query(
      `ALTER TABLE "rental" DROP CONSTRAINT "FK_2c47c15ba0297857bf92f8231ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental" DROP CONSTRAINT "FK_266a0f55eaad9743f3911a8de6e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental" DROP CONSTRAINT "FK_c3ce970fc42de7edbedbd181e4c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental" DROP CONSTRAINT "FK_02f61ff986f64c2936b89bc879a"`,
    );
  }
}

module.exports = rental1648138826789;
