import { Injectable, UnauthorizedException, ConflictException, Logger, NotFoundException } from "@nestjs/common";
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
    // 1. Fetch registered customer users
    const users = await prisma.user.findMany({
      where: { role: "customer" },
      include: {
        customer: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const registeredCustomers = users.map((user) => ({
      id: user.id,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone || undefined,
      },
      loyaltyPoints: user.customer?.loyaltyPoints ?? 0,
      totalOrders: user.customer?.totalOrders ?? 0,
      totalSpent: user.customer?.totalSpent ?? 0,
      createdAt: user.createdAt.toISOString(),
      isGuest: false,
    }));

    // 2. Fetch guest orders (orders where customerId is null)
    const guestOrders = await prisma.order.findMany({
      where: {
        customerId: null,
        customerPhone: { not: "" },
      },
      select: {
        customerName: true,
        customerPhone: true,
        customerEmail: true,
        total: true,
        createdAt: true,
      },
    });

    // 3. Group guest orders in memory by customerPhone
    const guestGroups: Record<string, {
      name: string;
      email: string;
      phone: string;
      totalOrders: number;
      totalSpent: number;
      createdAt: Date;
    }> = {};

    for (const order of guestOrders) {
      const phone = order.customerPhone;
      if (!guestGroups[phone]) {
        guestGroups[phone] = {
          name: order.customerName,
          email: order.customerEmail || "Guest Checkout",
          phone: phone,
          totalOrders: 0,
          totalSpent: 0,
          createdAt: order.createdAt,
        };
      }
      guestGroups[phone].totalOrders += 1;
      guestGroups[phone].totalSpent += order.total;
      if (order.createdAt < guestGroups[phone].createdAt) {
        guestGroups[phone].createdAt = order.createdAt;
      }
    }

    const guestCustomers = Object.values(guestGroups).map((guest, idx) => ({
      id: `guest-${guest.phone || idx}`,
      user: {
        name: guest.name,
        email: guest.email,
        phone: guest.phone,
      },
      loyaltyPoints: 0,
      totalOrders: guest.totalOrders,
      totalSpent: guest.totalSpent,
      createdAt: guest.createdAt.toISOString(),
      isGuest: true,
    }));

    // 4. Combine and sort by createdAt descending
    return [...registeredCustomers, ...guestCustomers].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async logout(userId: string) {
    await prisma.user.update({ where: { id: userId }, data: { refreshToken: null } });
  }

  async changePassword(userId: string, oldPass: string, newPass: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException("User not found");

    const isValid = await bcrypt.compare(oldPass, user.password);
    if (!isValid) throw new UnauthorizedException("Invalid current password");

    const hashed = await bcrypt.hash(newPass, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });
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
