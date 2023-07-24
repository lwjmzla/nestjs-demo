import {Entity , Column ,PrimaryGeneratedColumn, CreateDateColumn, Generated} from 'typeorm'

@Entity()
export class Roles{
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn({type:"timestamp"}) // !键入时间
  entryTime:Date

}