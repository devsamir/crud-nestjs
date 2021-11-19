import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty({ message: 'title tidak boleh kosong' })
  @IsString({ message: 'title harus string' })
  title: string;
  @IsNotEmpty({ message: 'body tidak boleh kosong' })
  @IsString({ message: 'body harus string' })
  body: string;
  @IsNotEmpty({ message: 'userId tidak boleh kosong' })
  @IsNumber({}, { message: 'userId harus number' })
  userId: number;
}
export class UpdatePostPutDto {
  @IsNotEmpty({ message: 'title tidak boleh kosong' })
  @IsString({ message: 'title harus string' })
  title: string;
  @IsNotEmpty({ message: 'body tidak boleh kosong' })
  @IsString({ message: 'body harus string' })
  body: string;
  @IsNotEmpty({ message: 'userId tidak boleh kosong' })
  @IsNumber({}, { message: 'userId harus number' })
  userId: number;
}
export class UpdatePostPatchDto {
  @IsOptional()
  @IsNotEmpty({ message: 'title tidak boleh kosong' })
  @IsString({ message: 'title harus string' })
  title: string;
  @IsOptional()
  @IsNotEmpty({ message: 'body tidak boleh kosong' })
  @IsString({ message: 'body harus string' })
  body: string;
  @IsOptional()
  @IsNotEmpty({ message: 'userId tidak boleh kosong' })
  @IsNumber({}, { message: 'userId harus number' })
  userId: number;
}
export class PostDto {
  @Expose()
  id: number;
  @Expose()
  userId: number;
  @Expose()
  title: string;
  @Expose()
  body: string;
}
