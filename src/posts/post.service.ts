import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { response } from 'express';
import { Repository } from 'typeorm';
import axios from '../config/myAxios';
import {
  CreatePostDto,
  UpdatePostPatchDto,
  UpdatePostPutDto,
} from './post.dto';
import { Posts } from './post.entity';

interface User {
  id: number;
}

@Injectable()
export class PostService {
  constructor(@InjectRepository(Posts) private repo: Repository<Posts>) {}
  //   JSONPLACEHOLDER
  //   Get All Post from JsonPlaceHolder API
  async find(): Promise<Posts[]> {
    const { data } = await axios.get('/posts');
    const posts: Posts[] = await Promise.all(
      data.map(async (post: Posts) => {
        const newPost = this.repo.create(post);
        return this.repo.save(newPost);
      }),
    );
    return posts;
  }
  //   Get one Post from JsonPlaceHolder API
  async findOne(id: number): Promise<Posts> {
    const { data } = await axios.get(`/posts/${id}`).catch(() => {
      throw new NotFoundException('post tidak ditemukan');
    });
    return data;
  }
  //   Create Post using JsonPlaceHolder API
  async create(body: CreatePostDto): Promise<Posts> {
    const { data } = await axios.post('/posts', body);
    return data;
  }
  //   Update post dengan method put
  async updatePut(id: number, body: UpdatePostPutDto): Promise<Posts> {
    await axios.get(`/posts/${id}`).catch(() => {
      throw new NotFoundException('post tidak ditemukan');
    });
    const { data } = await axios.put(`/posts/${id}`, body);
    return data;
  }
  //   update post dengan method patch
  async updatePatch(id: number, body: UpdatePostPatchDto): Promise<Posts> {
    const { data: post } = await axios.get(`/posts/${id}`).catch(() => {
      throw new NotFoundException('post tidak ditemukan');
    });
    Object.assign(post, body);
    const { data } = await axios.put(`/posts/${id}`, post);
    return data;
  }
  async delete(id: number) {
    await axios.delete(`/posts/${id}`);
  }
  //   Check if user is exist in JsonPlaceHolder API
  async checkUser(userId: number): Promise<User> {
    const { data } = await axios.get(`/users/${userId}`).catch(() => {
      throw new NotFoundException('userId tidak ditemukan');
    });
    return data;
  }

  //   LOCAL
  //   Get All Post from local database
  async findLocal(): Promise<Posts[]> {
    return this.repo.find({ order: { lastupdate: 'DESC' } });
  }
  //   create post for local database
  saveLocal(body: CreatePostDto): Promise<Posts> {
    const post = this.repo.create(body);
    return this.repo.save({ ...post, lastupdate: new Date() });
  }
  //   get one post from local database
  findOneLocal(id: number) {
    return this.repo.findOne(id);
  }
  async deleteLocal(post: Posts) {
    return this.repo.remove(post);
  }
}
