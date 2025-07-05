import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  artist: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column()
  rtl: boolean; // Right-to-left text support, e.g., for Hebrew songs

  // JSON data: each song has an array of lines, each line is an array of { lyrics, chords? }
  @Column({ type: 'text' })
  content: any;
}
