import {
    Button,
    Dialog,
    Portal,
  } from "@chakra-ui/react";

  import { InputPin } from "../InputPin";
  
  import * as S from './styles';
  
  interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
  }
  
  export const Modal = ({ isOpen, onClose }: ModalProps) => {
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
                        <Dialog.Content padding="16px" gap="16px">
                            <Dialog.Header>
                                <Dialog.Title textAlign="center">Digite seu código de recuperação</Dialog.Title>
                            </Dialog.Header>

                            <Dialog.Body>
                                <InputPin />
                            </Dialog.Body>

                            <Dialog.Footer justifyContent="center">
                                <Dialog.ActionTrigger asChild>
                                    <Button variant="outline" onClick={onClose} padding="16px">Cancelar</Button>
                                </Dialog.ActionTrigger>

                                <Button padding="16px">Salvar</Button>
                            </Dialog.Footer>
                        </Dialog.Content>
                    </S.Container>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
  };
  