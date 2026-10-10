import { Model } from "@nozbe/watermelondb";

import { defineColumns } from "../define-columns";

export class Note extends Model {
  static table = "notes";

  title!: string;
  /** Epoch ms; WatermelonDB fills `created_at` / `updated_at` automatically. */
  createdAt!: number;
  updatedAt!: number;
}

Object.defineProperties(
  Note.prototype,
  defineColumns({ title: "title", createdAt: "created_at", updatedAt: "updated_at" }),
);
