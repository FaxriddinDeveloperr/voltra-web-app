import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import type { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
    return user;
  }

  async updateMe(userId: string, dto: UpdateProfileDto): Promise<User> {
    return this.prisma.user.update({ where: { id: userId }, data: dto });
  }

  async deleteMe(userId: string): Promise<{ success: boolean }> {
    await this.prisma.user.delete({ where: { id: userId } });
    return { success: true };
  }
}
