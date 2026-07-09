import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery } from "@nestjs/swagger";

export const CurrentUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;
  return data ? user?.[data] : user;
});

export function ApiPaginatedResponse(model: string) {
  return (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiBearerAuth()(target, propertyKey, descriptor);
    ApiQuery({ name: "page", required: false, type: Number })(target, propertyKey, descriptor);
    ApiQuery({ name: "limit", required: false, type: Number })(target, propertyKey, descriptor);
  };
}
