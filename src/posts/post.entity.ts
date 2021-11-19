import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Posts {
  @PrimaryColumn()
  id: number;
  @Column()
  userId: number;
  @Column()
  title: string;
  @Column()
  body: string;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastupdate: Date;
}
