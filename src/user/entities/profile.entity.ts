import {Entity , Column ,PrimaryGeneratedColumn, CreateDateColumn, Generated} from 'typeorm'

@Entity()
export class Profile{

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gender: number;

  @Column()
  photo: string;

  @Column()
  address: string;

  @CreateDateColumn({type:"timestamp"}) // !键入时间
  entryTime:Date;
  
}