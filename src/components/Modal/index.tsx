import {
    Button,
    Dialog,
    Portal,
  } from "@chakra-ui/react";
  
  import * as S from './styles';
  
  interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
  }
  
  export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
    return (
        <Dialog.Root 
        open={isOpen} 
        placement="center"
        closeOnEscape={false}
        closeOnInteractOutside={false}
        onOpenChange={(e) => !e.open && onClose()}>
            <Portal>
                <Dialog.Backdrop />

                <Dialog.Positioner>
                    <S.Container>
                        <Dialog.Content gap="16px" borderRadius="8px">
                           {children}
                        </Dialog.Content>
                    </S.Container>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
  };
  