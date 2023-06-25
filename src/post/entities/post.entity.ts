import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { Account } from 'src/account/entities/account.entity';

import { AbstractEntity } from 'utils/abstractEntity';

@Entity()
export class Post extends AbstractEntity {
  @Index({ fulltext: true })
  @Column({ type: 'varchar', length: 120, default: '' })
  title: string;

  @Index({ fulltext: true })
  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({ type: 'boolean', default: false })
  posted = false;

  @ManyToOne(() => Account, (owner) => owner.posts, {
    nullable: false,
  })
  owner: Account;

  @Column({ nullable: false })
  ownerId: number;

  @Column({ type: 'json', nullable: true})
  featured_photos: Array<string>
}
