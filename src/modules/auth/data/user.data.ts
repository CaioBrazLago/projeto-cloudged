import { User, UserRole } from '../entities/user.entity';

export const users: User[] = [
  new User(
    'ana',
    '$2b$10$6QGr/EhxkZKk0bKJF0zus.wPE8KHSdEo0hAQ4gShaH313xy3rq1pq',
    UserRole.OPERADOR,
  ),

  new User(
    'carlos',
    '$2b$10$Db0F2slBglXbt4rKkc7obe0znNDGKEQSHV28KZ2lZTws5MxpIGoXS',
    UserRole.AUDITOR,
  ),
];
