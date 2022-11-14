import { VoidDelegate } from "./voidDelegate";

export type ModalProp = {
  modalIsOpen: boolean;
  setModalIsOpen: VoidDelegate;
};

export type MultiModalProp = {
  modal1: ModalProp;
  modal2: ModalProp;
};
