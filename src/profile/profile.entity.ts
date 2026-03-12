import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true, length: 10 })
  firstName: string;

  @Column({ type: 'varchar', nullable: true, length: 10 })
  lastName: string;

  @Column({ type: 'varchar', nullable: true, length: 7 })
  gender: string;

  @Column({ type: 'boolean', nullable: true })
  isMarried?: boolean;

  @Column({ type: 'timestamp', nullable: true })
  dateOfBirth: Date;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'text', nullable: true })
  profileImage: string;

  @OneToOne(() => User, (user) => user.profile, {
    // eager:true
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
