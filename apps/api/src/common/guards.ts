import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

export const ROLES_KEY = "roles";

export function Roles(...roles: string[]) {
  return (target: object, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) => {
    Reflect.defineMetadata(ROLES_KEY, roles, descriptor?.value ?? target);
  };
}

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;
    const { user } = context.switchToHttp().getRequest();
    if (!requiredRoles.includes(user?.role)) {
      throw new ForbiddenException("Insufficient permissions");
    }
    return true;
  }
}

@Injectable()
export class OptionalAuthGuard extends AuthGuard("jwt") {
  handleRequest(err: any, user: any) {
    // If auth fails or token is missing, return null instead of throwing
    return user || null;
  }
}
