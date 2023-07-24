import {Entity , Column ,PrimaryGeneratedColumn, CreateDateColumn, Generated} from 'typeorm'

@Entity()
export class User{
  
  // @PrimaryGeneratedColumn("uuid") // !id为自增的列
  // id:string

  // @Column({type:"varchar",length:255})
  // name:string

  // @Column({type:"int"})
  // age:number

  // @Column({type:"varchar"})
  // skill:string

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @CreateDateColumn({type:"timestamp"}) // !键入时间
  entryTime:Date

  // @Generated('uuid')
  // uuid:string
}