import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  ManyToMany,
  OneToOne,
} from 'typeorm';
import { Account } from 'src/account/entities/account.entity';
import { Photo } from 'src/photo/entities/photo.entity';
import { AbstractEntity } from 'utils/abstractEntity';
import { JoinTable } from 'typeorm';

@Entity()
export class Category extends AbstractEntity {
  @Index({ fulltext: true })
  @Column({ type: 'varchar', length: 120, default: '' })
  title: string;

  @Index({ fulltext: true })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => Account, (owner) => owner.posts, { nullable: false })
  owner: Account;

  @Column({ nullable: false })
  ownerId: number;

  @ManyToMany(() => Photo, (photo) => photo.categories, {
    eager: true,
    onDelete: "CASCADE"
  })
  @JoinTable()
  photos: Photo[];

  @Column({ type: 'boolean', default: false })
  posted = false;

  @ManyToOne(() => Photo, {
    eager: true,
    onDelete: 'SET NULL'
  })
  cover: Photo;
}
