import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  title!: string;

  @Column("date", { nullable: true })
  dueDate!: Date;

  @Column("boolean", { default: false })
  completed: boolean = false;
  @Column("boolean", { default: false })
important: boolean = false;

@Column("text", { nullable: true })
difficulty!: string;

@Column("text", { nullable: true })
label!: string;
}