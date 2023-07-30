// !TypeOrm CLI  npx typeorm init --database mysql2
import AppDataSource from '../ormconfig'
import { User } from './user/entities/user.entity'

AppDataSource.initialize().then(async () => {

    const res = await AppDataSource.manager.find(User)
    console.log(res)

    console.log("Here you can setup and run express / fastify / any other framework.")

}).catch(error => console.log(error))
