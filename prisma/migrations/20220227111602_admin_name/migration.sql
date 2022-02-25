/*
  Warnings:

  - Added the required column `name` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Admin" ("email", "id", "passwordHash") SELECT "email", "id", "passwordHash" FROM "Admin";
DROP TABLE "Admin";
ALTER TABLE "new_Admin" RENAME TO "Admin";
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
