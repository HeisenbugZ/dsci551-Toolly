const { MigrationInterface, QueryRunner } = require('typeorm');
class add_lat_lg1650770327987 {
  name = 'add_lat_lg1650770327987';
  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "latitude" double precision NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "longitude" double precision NOT NULL DEFAULT '0'`,
    );
  }
  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "latitude"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "longitude"`);
  }
}

module.exports = add_lat_lg1650770327987;
