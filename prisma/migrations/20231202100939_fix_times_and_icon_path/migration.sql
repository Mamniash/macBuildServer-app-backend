/*
  Warnings:

  - You are about to drop the column `icon_path` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `times` on the `Workout` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Exercise_name_key";

-- DropIndex
DROP INDEX "Workout_name_key";

-- AlterTable
ALTER TABLE "Workout" DROP COLUMN "icon_path",
DROP COLUMN "times";
