/*
  Warnings:

  - The primary key for the `SeriesPart` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SeriesPart" (
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "htmlTitle" TEXT,
    "description" TEXT NOT NULL,
    "category" TEXT,
    "content" TEXT NOT NULL,
    "lastModified" DATETIME,
    "seriesPart" INTEGER NOT NULL,
    "seriesSlug" TEXT NOT NULL,

    PRIMARY KEY ("slug", "seriesSlug"),
    CONSTRAINT "SeriesPart_seriesSlug_fkey" FOREIGN KEY ("seriesSlug") REFERENCES "Series" ("slug") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SeriesPart" ("category", "content", "description", "htmlTitle", "lastModified", "seriesPart", "seriesSlug", "slug", "title") SELECT "category", "content", "description", "htmlTitle", "lastModified", "seriesPart", "seriesSlug", "slug", "title" FROM "SeriesPart";
DROP TABLE "SeriesPart";
ALTER TABLE "new_SeriesPart" RENAME TO "SeriesPart";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
