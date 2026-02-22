/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Service - Auth
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdminRepository } from '../repositories';
import { env } from '../config';
import { AppError } from '../utils/AppError';
import { LoginDTO } from '../dtos';

export class AuthService {
  private adminRepository: AdminRepository;

  constructor() {
    this.adminRepository = new AdminRepository();
  }

  async login(data: LoginDTO) {
    const admin = await this.adminRepository.findByEmail(data.email);

    if (!admin) {
      throw new AppError('Email ou senha incorretos', 401);
    }

    const senhaCorreta = await bcrypt.compare(data.senha, admin.senha);

    if (!senhaCorreta) {
      throw new AppError('Email ou senha incorretos', 401);
    }

    const token = jwt.sign({ id: admin.id }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    } as jwt.SignOptions);

    return {
      admin: {
        id: admin.id,
        nome: admin.nome,
        email: admin.email,
      },
      token,
    };
  }

  async getProfile(adminId: string) {
    const admin = await this.adminRepository.findById(adminId);

    if (!admin) {
      throw new AppError('Admin não encontrado', 404);
    }

    return {
      id: admin.id,
      nome: admin.nome,
      email: admin.email,
      createdAt: admin.createdAt,
    };
  }
}
