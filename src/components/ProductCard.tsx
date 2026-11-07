import React from 'react';
import { Card, Button, Chip } from '@heroui/react';
import { IconPlus } from '@tabler/icons-react';
import type { MenuItem } from '../types/catalog';
import { formatRupiah } from '../utils/whatsapp';

interface ProductCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item, onSelect }) => {
  return (
    <Card
      variant="default"
      className="cursor-pointer transition-transform hover:-translate-y-0.5"
      onClick={() => onSelect(item)}
    >
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-t-xl bg-default">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
        {!item.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <Chip color="danger" variant="primary" size="sm">
              Habis
            </Chip>
          </div>
        )}
      </div>

      <Card.Header className="p-3 pb-1">
        <Card.Title className="text-sm font-semibold line-clamp-1">
          {item.name}
        </Card.Title>
        <Card.Description className="text-xs line-clamp-2 mt-0.5">
          {item.description}
        </Card.Description>
      </Card.Header>

      <Card.Footer className="p-3 pt-2 flex items-center justify-between border-t border-separator mt-auto">
        <div>
          <span className="text-[11px] text-muted block leading-none">Mulai</span>
          <span className="text-sm font-bold text-foreground">
            {formatRupiah(item.basePrice)}
          </span>
        </div>

        <Button
          isIconOnly
          size="sm"
          variant="primary"
          isDisabled={!item.isAvailable}
          aria-label={`Tambah ${item.name}`}
          onPress={() => onSelect(item)}
        >
          <IconPlus size={16} stroke={2} />
        </Button>
      </Card.Footer>
    </Card>
  );
};
