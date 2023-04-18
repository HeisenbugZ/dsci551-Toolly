const { MigrationInterface, QueryRunner } = require('typeorm');
class add_group1650614720125 {
  name = 'add_group1650614720125';
  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "category" ADD "group" character varying NOT NULL DEFAULT ''`,
    );
  }
  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "group"`);
  }
}

module.exports = add_group1650614720125;
