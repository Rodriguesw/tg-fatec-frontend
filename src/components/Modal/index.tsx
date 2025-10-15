import {
    Button,
    Dialog,
    Portal,
  } from "@chakra-ui/react";
  
  import * as S from './styles';
  
  interface ModalProps {
    width?: string
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    hideBackdrop?: boolean;
  }
  
  export const Modal = ({ isOpen, onClose, children, width, hideBackdrop }: ModalProps) => {
    return (
        <Dialog.Root 
        open={isOpen} 
        placement="center"
        closeOnEscape={false}
        closeOnInteractOutside={false}
        onOpenChange={(e) => !e.open && onClose()}>
            <Portal>
                { !hideBackdrop && <Dialog.Backdrop /> }

                <Dialog.Positioner>
                    <S.Container width={width}>
                        <Dialog.Content gap="16px" borderRadius="20px">
                           {children}
                        </Dialog.Content>
                    </S.Container>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
  };
  