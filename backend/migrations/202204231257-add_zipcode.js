const { MigrationInterface, QueryRunner } = require('typeorm');
class add_zipcode1650686261361 {
  name = 'add_zipcode1650686261361';
  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "zipcode" character varying NOT NULL DEFAULT '00000'`,
    );
  }
  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "zipcode"`);
  }
}

module.exports = add_zipcode1650686261361;
