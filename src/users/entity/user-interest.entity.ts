import { IsNumber, IsString, IsUUID } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserProfile } from './user-profile.entity';

@Entity()
export class UserInterest {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @ApiProperty()
  @Column({ length: 255 })
  @IsString()
  field: string;

  @ApiProperty()
  @Column()
  @IsNumber()
  value: number;

  @Column('uuid')
  @IsUUID('4')
  profile_id: string;

  /** Relations */

  // @ManyToOne((type) => UserProfile, (userProfile) => userProfile.interests, {
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn({ name: 'profile_id', referencedColumnName: 'id' })
  // profile: UserProfile;
}
