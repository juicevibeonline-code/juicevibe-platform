import { Injectable, UnauthorizedException, ConflictException, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { prisma } from "@juice-vibe/database";
import * as bcrypt from "bcryptjs";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private jwtService: JwtService) {}

  async register(input: { name: string; email: string; password: string; phone?: string }) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw new ConflictException("Email already registered");

    const hashedPassword = await bcrypt.hash(input.password, 12);
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hashedPassword,
        phone: input.phone,
      },
    });

    if (user.role === "customer") {
      await prisma.customer.create({
        data: { userId: user.id },
      });
    }

    const tokens = this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  async login(input: { email: string; password: string }) {
    console.log("PRISMA OBJECT:", prisma);
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const isValid = await bcrypt.compare(input.password, user.password);
    if (!isValid) throw new UnauthorizedException("Invalid credentials");

    if (!user.isActive) throw new UnauthorizedException("Account is deactivated");

    const tokens = this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, { secret: process.env.JWT_REFRESH_SECRET ?? (() => { throw new Error("JWT_REFRESH_SECRET environment variable is required"); })() });
      const user = await prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user || !user.refreshToken) throw new UnauthorizedException("Invalid refresh token");

      const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isValid) throw new UnauthorizedException("Invalid refresh token");

      const tokens = this.generateTokens(user.id, user.email, user.role);
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException("User not found");
    return this.sanitizeUser(user);
  }

  async getCustomers() {
    const users = await prisma.user.findMany({
      where: { role: "customer" },
      include: {
        customer: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || undefined,
      orderCount: user.customer?.totalOrders ?? 0,
      totalSpent: user.customer?.totalSpent ?? 0,
      createdAt: user.createdAt.toISOString(),
    }));
  }

  async logout(userId: string) {
    await prisma.user.update({ where: { id: userId }, data: { refreshToken: null } });
  }


  private generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET ?? (() => { throw new Error("JWT_REFRESH_SECRET environment variable is required"); })(),
        expiresIn: "30d",
      }),
    };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashed = await bcrypt.hash(refreshToken, 12);
    await prisma.user.update({ where: { id: userId }, data: { refreshToken: hashed } });
  }

  private sanitizeUser(user: any) {
    const { password, refreshToken, ...rest } = user;
    return rest;
  }
}
