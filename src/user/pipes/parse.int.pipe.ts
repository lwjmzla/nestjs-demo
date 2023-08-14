import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";

export class ParseIntPipeCustom implements PipeTransform<string | undefined, Promise<number | undefined>> {
  transform(value: string | undefined, metadata: ArgumentMetadata): Promise<number | undefined> {
    // console.log(metadata.data) // !page      =>   key
    // console.log(metadata.metatype) // !Function: Number
    // console.log(metadata.type) // !query    =>    @Query
    return new Promise(resolve => {
      if (value === undefined || value === '') {
        return resolve(undefined);
      }

      if (!isNaN(Number(value))) {
        return resolve(Number(value));
      }

      throw new BadRequestException(`Validation failed for argument '${metadata.data}' (optional number is expected)`);
    });
  }
}