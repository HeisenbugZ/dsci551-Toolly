const { MigrationInterface, QueryRunner } = require('typeorm');
class init1647237831054 {
  name = 'init1647237831054';
  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "address" character varying NOT NULL, "hashedPassword" character varying NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "role" character varying NOT NULL DEFAULT 'client', "profilePhotoUrl" character varying, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "file" ("url" character varying NOT NULL, "name" character varying NOT NULL, "mimeType" character varying NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "createdById" integer, CONSTRAINT "PK_ff5d246bb5831ad7351f87e67cb" PRIMARY KEY ("url"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "token" ("hashedToken" character varying NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "expiry" TIMESTAMP WITH TIME ZONE NOT NULL, "userId" integer, CONSTRAINT "PK_81bb803c8201d920b1a61b1b8c9" PRIMARY KEY ("hashedToken"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tool" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "introduction" character varying NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_3bf5b1016a384916073184f99b7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "createdById" integer, CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tool_photos_file" ("toolId" integer NOT NULL, "fileUrl" character varying NOT NULL, CONSTRAINT "PK_4e6c3f22d0a78f24c98181b58b1" PRIMARY KEY ("toolId", "fileUrl"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_74c9417916d1850fda148a9eb8" ON "tool_photos_file" ("toolId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e2a66d1bdd33bf7296955d77e7" ON "tool_photos_file" ("fileUrl") `,
    );
    await queryRunner.query(
      `CREATE TABLE "tool_categories_category" ("toolId" integer NOT NULL, "categoryId" integer NOT NULL, CONSTRAINT "PK_3e6166555ac16511efd535f5d61" PRIMARY KEY ("toolId", "categoryId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0db3fcd405e3d9a4a5cddcc91f" ON "tool_categories_category" ("toolId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_02886b7845bc3d1ff055293d41" ON "tool_categories_category" ("categoryId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "category_photos_file" ("categoryId" integer NOT NULL, "fileUrl" character varying NOT NULL, CONSTRAINT "PK_cb23591d1e2c955c085bb2052a0" PRIMARY KEY ("categoryId", "fileUrl"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2da73c53913002b9c2e8650ee2" ON "category_photos_file" ("categoryId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8de508cc9dd4e321a24f0fcdd8" ON "category_photos_file" ("fileUrl") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_d5b44cf79b58c9d130f6eeb4a19" FOREIGN KEY ("profilePhotoUrl") REFERENCES "file"("url") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "file" ADD CONSTRAINT "FK_d7187ebff85831dd00deaa3e0cc" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" ADD CONSTRAINT "FK_94f168faad896c0786646fa3d4a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tool" ADD CONSTRAINT "FK_68b86fcfc928d194f745a50939d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" ADD CONSTRAINT "FK_50c69cdc9b3e7494784a2fa2db4" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tool_photos_file" ADD CONSTRAINT "FK_74c9417916d1850fda148a9eb88" FOREIGN KEY ("toolId") REFERENCES "tool"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "tool_photos_file" ADD CONSTRAINT "FK_e2a66d1bdd33bf7296955d77e79" FOREIGN KEY ("fileUrl") REFERENCES "file"("url") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "tool_categories_category" ADD CONSTRAINT "FK_0db3fcd405e3d9a4a5cddcc91f2" FOREIGN KEY ("toolId") REFERENCES "tool"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "tool_categories_category" ADD CONSTRAINT "FK_02886b7845bc3d1ff055293d410" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_photos_file" ADD CONSTRAINT "FK_2da73c53913002b9c2e8650ee2c" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_photos_file" ADD CONSTRAINT "FK_8de508cc9dd4e321a24f0fcdd89" FOREIGN KEY ("fileUrl") REFERENCES "file"("url") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "file"`);
    await queryRunner.query(`DROP TABLE "token"`);
    await queryRunner.query(`DROP TABLE "tool"`);
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(`DROP TABLE "tool_photos_file"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_74c9417916d1850fda148a9eb8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e2a66d1bdd33bf7296955d77e7"`,
    );
    await queryRunner.query(`DROP TABLE "tool_categories_category"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0db3fcd405e3d9a4a5cddcc91f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_02886b7845bc3d1ff055293d41"`,
    );
    await queryRunner.query(`DROP TABLE "category_photos_file"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2da73c53913002b9c2e8650ee2"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8de508cc9dd4e321a24f0fcdd8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_d5b44cf79b58c9d130f6eeb4a19"`,
    );
    await queryRunner.query(
      `ALTER TABLE "file" DROP CONSTRAINT "FK_d7187ebff85831dd00deaa3e0cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" DROP CONSTRAINT "FK_94f168faad896c0786646fa3d4a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tool" DROP CONSTRAINT "FK_68b86fcfc928d194f745a50939d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" DROP CONSTRAINT "FK_50c69cdc9b3e7494784a2fa2db4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tool_photos_file" DROP CONSTRAINT "FK_74c9417916d1850fda148a9eb88"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tool_photos_file" DROP CONSTRAINT "FK_e2a66d1bdd33bf7296955d77e79"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tool_categories_category" DROP CONSTRAINT "FK_0db3fcd405e3d9a4a5cddcc91f2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tool_categories_category" DROP CONSTRAINT "FK_02886b7845bc3d1ff055293d410"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_photos_file" DROP CONSTRAINT "FK_2da73c53913002b9c2e8650ee2c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_photos_file" DROP CONSTRAINT "FK_8de508cc9dd4e321a24f0fcdd89"`,
    );
  }
}

module.exports = init1647237831054;
