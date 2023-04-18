const { MigrationInterface, QueryRunner } = require('typeorm');
class rename_rental1650444781251 {
  name = 'rename_rental1650444781251';
  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "rental" DROP CONSTRAINT "FK_c3ce970fc42de7edbedbd181e4c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental" RENAME COLUMN "borrowerId" TO "lenderId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental" ADD CONSTRAINT "FK_61e86ffdb59ce3b4add6ca51223" FOREIGN KEY ("lenderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "rental" ADD CONSTRAINT "FK_c3ce970fc42de7edbedbd181e4c" FOREIGN KEY ("borrowerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental" RENAME COLUMN "lenderId" TO "borrowerId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rental" DROP CONSTRAINT "FK_61e86ffdb59ce3b4add6ca51223"`,
    );
  }
}

module.exports = rename_rental1650444781251;
