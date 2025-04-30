import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Check } from 'lucide-react';
import { avatarOptions } from '@/utils/avatarOptions';

interface AvatarSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (avatarUrl: string) => void;
  currentAvatarUrl?: string;
}

const AvatarSelectionModal: React.FC<AvatarSelectionModalProps> = ({
  open,
  onOpenChange,
  onSelect,
  currentAvatarUrl
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string | undefined>(currentAvatarUrl);

  const handleSelect = () => {
    if (selectedAvatar) {
      onSelect(selectedAvatar);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose an Avatar</DialogTitle>
          <DialogDescription>
            Select an avatar for your profile.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 py-4">
          {avatarOptions.map((avatar) => (
            <div 
              key={avatar.id} 
              className={`relative cursor-pointer transition-all duration-200 ${
                selectedAvatar === avatar.url 
                  ? 'ring-2 ring-primary ring-offset-2 scale-105' 
                  : 'hover:scale-105'
              }`}
              onClick={() => setSelectedAvatar(avatar.url)}
            >
              <Avatar className="h-16 w-16 mx-auto">
                <AvatarImage src={avatar.url} alt={avatar.alt} />
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
              {selectedAvatar === avatar.url && (
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </div>
          ))}
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSelect} disabled={!selectedAvatar}>
            Select Avatar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarSelectionModal;
