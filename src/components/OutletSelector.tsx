import React, { useState } from 'react';
import { Card, Button, Input, Modal, Chip } from '@heroui/react';
import {
  IconBuildingStore,
  IconChevronDown,
  IconMapPin,
  IconClock,
  IconCheck,
} from '@tabler/icons-react';
import type { Outlet } from '../types/catalog';

interface OutletSelectorProps {
  outlets: Outlet[];
  currentOutlet: Outlet;
  onSelectOutlet: (outlet: Outlet) => void;
}

export const OutletSelector: React.FC<OutletSelectorProps> = ({
  outlets,
  currentOutlet,
  onSelectOutlet,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOutlets = outlets.filter(
    (outlet) =>
      outlet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outlet.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Trigger Bar Card */}
      <Card
        variant="secondary"
        className="cursor-pointer transition-colors hover:border-accent"
        onClick={() => setIsOpen(true)}
      >
        <Card.Content className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
              <IconBuildingStore size={22} stroke={1.5} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase font-semibold tracking-wider text-muted">
                  Pilih Gerai
                </span>
                <Chip size="sm" variant="soft" color="success" className="h-5 px-1.5 text-[10px]">
                  Buka
                </Chip>
              </div>
              <p className="text-sm font-semibold text-foreground truncate mt-0.5">
                {currentOutlet.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-muted shrink-0 pl-2">
            <span className="text-xs font-medium hidden sm:inline">Ganti</span>
            <IconChevronDown size={18} stroke={1.75} />
          </div>
        </Card.Content>
      </Card>

      {/* HeroUI Modal untuk Pemilihan Outlet */}
      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <Modal.Backdrop variant="blur">
          <Modal.Container size="sm">
            <Modal.Dialog className="w-full">
              <Modal.Header>
                <Modal.Heading>Pilih Gerai Outlet</Modal.Heading>
                <Modal.CloseTrigger />
              </Modal.Header>

              <Modal.Body className="space-y-3 pt-1">
                <Input
                  fullWidth
                  variant="secondary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama gerai atau area..."
                  aria-label="Cari outlet"
                />

                <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
                  {filteredOutlets.map((outlet) => {
                    const isSelected = outlet.id === currentOutlet.id;
                    return (
                      <Card
                        key={outlet.id}
                        variant={isSelected ? 'tertiary' : 'default'}
                        className={`cursor-pointer transition-colors p-3 ${
                          isSelected ? 'border-accent' : ''
                        }`}
                        onClick={() => {
                          onSelectOutlet(outlet);
                          setIsOpen(false);
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm text-foreground truncate">
                                {outlet.name}
                              </span>
                              {isSelected && (
                                <Chip size="sm" variant="primary" color="accent" className="h-4.5 text-[10px]">
                                  Aktif
                                </Chip>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted mb-1">
                              <IconMapPin size={14} className="shrink-0" />
                              <span className="truncate">{outlet.address}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted">
                              <IconClock size={14} className="shrink-0" />
                              <span>{outlet.openingHours}</span>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center shrink-0 mt-1">
                              <IconCheck size={14} stroke={2.5} />
                            </div>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </Modal.Body>

              <Modal.Footer>
                <Button
                  variant="secondary"
                  fullWidth
                  onPress={() => setIsOpen(false)}
                >
                  Tutup
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
};
