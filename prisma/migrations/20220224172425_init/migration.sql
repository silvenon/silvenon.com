-- CreateTable
CREATE TABLE "StandalonePost" (
    "slug" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "htmlTitle" TEXT,
    "description" TEXT NOT NULL,
    "category" TEXT,
    "published" DATETIME,
    "content" TEXT NOT NULL,
    "lastModified" DATETIME,
    "tweet" TEXT
);

-- CreateTable
CREATE TABLE "SeriesPart" (
    "slug" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "htmlTitle" TEXT,
    "description" TEXT NOT NULL,
    "category" TEXT,
    "content" TEXT NOT NULL,
    "lastModified" DATETIME,
    "seriesSlug" TEXT NOT NULL,
    CONSTRAINT "SeriesPart_seriesSlug_fkey" FOREIGN KEY ("seriesSlug") REFERENCES "Series" ("slug") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Series" (
    "slug" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "htmlTitle" TEXT,
    "description" TEXT NOT NULL,
    "published" DATETIME,
    "tweet" TEXT
);
