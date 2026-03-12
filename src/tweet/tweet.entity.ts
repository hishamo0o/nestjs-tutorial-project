import { Hashtag } from 'src/hashtag/entities/hashtag.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Tweet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  text: string;

  @Column({ type: 'text', nullable: true })
  image?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAl: Date;

  @ManyToOne(()=>User , (user)=>user.tweets )
  user:User;

  @ManyToMany(()=>Hashtag , (hashtag)=>hashtag.tweets)
  @JoinTable()
  hashtags:Hashtag[];

}
