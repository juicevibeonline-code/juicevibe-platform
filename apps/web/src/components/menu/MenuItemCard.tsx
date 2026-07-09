"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { MenuItem } from "@/data/menu";

interface MenuItemCardProps {
  item: MenuItem;
  index: number;
}

const categoryGradients: Record<string, string> = {
  milkshakes: "from-orange to-orange/80",
  "fresh-juices": "from-primary to-primary-dark",
  smoothies: "from-primary to-yellow",
  lassi: "from-yellow to-orange",
  tea: "from-yellow to-yellow/80",
  coffee: "from-dark-green to-primary-dark",
  mocktails: "from-pink to-pink/80",
  "ice-cream": "from-pink to-orange",
  burgers: "from-orange to-pink",
  sandwiches: "from-primary to-dark-green",
};

export function MenuItemCard({ item, index }: MenuItemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      whileHover={{ y: -4 }}
    >
      <Card hover className="group overflow-hidden">
        <div className={`h-2 bg-gradient-to-r ${categoryGradients[item.category] || "from-primary to-primary-dark"}`} />

        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            {item.image && (
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src={encodeURI(item.image)}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            )}
            <div className="flex flex-1 items-start justify-between gap-4 min-w-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-heading text-lg font-bold text-dark-green truncate">
                    {item.name}
                  </h3>
                  {item.popular && (
                    <Badge variant="primary" className="shrink-0">
                      <Star className="mr-1 h-3 w-3 fill-current" />
                      Popular
                    </Badge>
                  )}
                </div>
                <p className="mt-1.5 text-sm text-gray-500">{item.description}</p>
                {item.flavours && (
                  <p className="mt-1 text-xs text-primary font-medium">
                    Flavours: {item.flavours.join(", ")}
                  </p>
                )}
              </div>
              <div className="shrink-0 text-right">
                <div className="font-heading text-xl font-extrabold text-primary">
                  {formatPrice(item.price)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
