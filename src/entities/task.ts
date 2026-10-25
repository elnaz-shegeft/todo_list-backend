import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  // Nullable so existing databases can add the column without losing old tasks.
  // Tasks without an owner are never returned by the API.
  @Column("integer", { nullable: true })
  ownerId!: number | null;

  @Column("text")
  title!: string;

  @Column("date", { nullable: true })
  dueDate!: string | null;

  @Column("boolean", { default: false })
  completed: boolean = false;
  @Column("boolean", { default: false })
  important: boolean = false;

  @Column("text", { nullable: true })
  difficulty!: string | null;

  @Column("text", { nullable: true })
  label!: string | null;
}
