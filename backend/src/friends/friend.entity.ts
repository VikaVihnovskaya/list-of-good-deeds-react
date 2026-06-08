import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique } from 'typeorm';

@Entity('friends')
@Unique(['userId', 'friendId'])
export class Friend {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  friendId: number;

  @CreateDateColumn()
  createdAt: Date;
}
