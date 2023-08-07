import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { GetUserDto } from 'src/user/dto';

@Injectable()
export class GetUserPipe implements PipeTransform {
  transform(value: GetUserDto, metadata: ArgumentMetadata) {
    console.log('GetUserPipe-before', value)
    const regNum = /^[0-9]+$/
    for (const key in value) {
      if (regNum.test(value[key])) {
        value[key] = parseInt(value[key])
      }
    }
    console.log('GetUserPipe-after', value)
    return value;
  }
}
