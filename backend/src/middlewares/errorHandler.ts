/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Middleware global de tratamento de erros
 */

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Erro de validação Zod
  if (error instanceof ZodError) {
    const errors = error.errors.map((e) => ({
      campo: e.path.join('.'),
      mensagem: e.message,
    }));

    res.status(400).json({
      status: 'error',
      message: 'Erro de validação',
      errors,
    });
    return;
  }

  // Erro customizado da aplicação
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
    return;
  }

  // Erro do Prisma - registro não encontrado
  if (error.name === 'PrismaClientKnownRequestError') {
    res.status(404).json({
      status: 'error',
      message: 'Registro não encontrado',
    });
    return;
  }

  // Erro inesperado
  console.error('❌ Erro interno:', error);
  res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor',
  });
}
