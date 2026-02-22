/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Controller - Auth
 */

import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services';
import { loginDTO } from '../dtos';
import { AuthRequest } from '../types';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = loginDTO.parse(req.body);
      const result = await this.authService.login(data);

      res.json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  profile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const admin = await this.authService.getProfile(req.adminId!);

      res.json({
        status: 'success',
        data: admin,
      });
    } catch (error) {
      next(error);
    }
  };
}
