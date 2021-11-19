import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Serialize } from 'src/Interceptors/serialize.interceptors';
import {
  CreatePostDto,
  PostDto,
  UpdatePostPatchDto,
  UpdatePostPutDto,
} from './post.dto';
import { Posts } from './post.entity';
import { PostService } from './post.service';

@Controller('post')
@Serialize(PostDto)
export class PostController {
  constructor(private postService: PostService) {}

  //   Get All Post dari jsonplaceholder api dan memasukannya ke database local
  @Get()
  async getAllPost(): Promise<Posts[]> {
    return this.postService.find();
  }

  //   Get All Post dari database local
  @Get('/local')
  async getAllPostLocal(): Promise<Posts[]> {
    return this.postService.findLocal();
  }

  //   membuat post dengan jsonplaceholder api dan memasukan post tersebut ke database local
  @Post()
  async createPost(@Body() body: CreatePostDto): Promise<Posts> {
    const user = await this.postService.checkUser(body.userId);
    const post = await this.postService.create({ ...body, userId: user.id });
    const cekId = await this.postService.findOneLocal(post.id);
    if (cekId) throw new BadRequestException('id post sudah dipakai');
    return this.postService.saveLocal(post);
  }

  //   mendapatkan satu post berdasarkan id dari jsonplaceholder
  @Get(':id')
  getOnePost(@Param('id') id: string) {
    return this.postService.findOne(Number(id));
  }

  //   mendapatkan satu post berdasarkan id dari jsonplaceholder
  @Get('/local/:id')
  async getOnePostLocal(@Param('id') id: string) {
    const post = await this.postService.findOneLocal(Number(id));
    if (!post) throw new BadRequestException('post tidak ditemukan');
    return post;
  }

  //   Melakukan update dengan jsonplaceholder api dan mengupdatekan nya ke database local menggunakan method put
  @Put(':id')
  async updatePost(@Param('id') id: string, @Body() body: UpdatePostPutDto) {
    const post = await this.postService.updatePut(Number(id), body);
    const cekPost = await this.postService.findOneLocal(Number(id));
    if (!cekPost)
      throw new BadRequestException(
        'post yang ingin diupdate (PUT) tidak ditemukan',
      );
    //   Cek UserId Valid
    await this.postService.checkUser(body.userId);
    return this.postService.saveLocal(post);
  }

  //   Melakukan update dengan jsonplaceholder api dan mengupdatekan nya ke database local menggunakan method patch
  @Patch(':id')
  async updatePartialPost(
    @Param('id') id: string,
    @Body() body: UpdatePostPatchDto,
  ) {
    const post = await this.postService.updatePatch(Number(id), body);

    const cekPost = await this.postService.findOneLocal(Number(id));
    if (!cekPost)
      throw new BadRequestException(
        'post yang ingin diupdate (PATCH) tidak ditemukan',
      );
    //   Cek UserId Valid
    await this.postService.checkUser(post.userId);
    return this.postService.saveLocal(post);
  }

  //   Melakukan delete dengan jsonplaceholder api dan delete data di database local
  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    await this.postService.delete(Number(id));
    const cekPost = await this.postService.findOneLocal(Number(id));
    if (!cekPost)
      throw new BadRequestException('post yang ingin didelete tidak ditemukan');
    return this.postService.deleteLocal(cekPost);
  }
}
