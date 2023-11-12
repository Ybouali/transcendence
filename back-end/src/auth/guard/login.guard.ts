import { AuthGuard } from '@nestjs/passport';

export class LoginGuard extends AuthGuard('refresh') {
  constructor() {
    super();
  }
}
