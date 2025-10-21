import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
interface AlertModalProps {
  content: string | null;
  modalIsOpen: boolean;
  closeModal: () => void;
}
export default function AlertModal({
  content,
  modalIsOpen,
  closeModal,
}: Readonly<AlertModalProps>) {
  useEffect(() => {
    if (modalIsOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [modalIsOpen]);

  if (!modalIsOpen || !content) {
    return null;
  }

  return (
    <div className="fixed left-0 top-0 h-dvh w-dvw backdrop-blur-sm flex items-center justify-center">
      <div className="p-4 m-auto border shadow-md rounded-md bg-white">
        <div className="pb-4 text-center">
          <button className="float-start text-2xl" onClick={closeModal}>
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>
        <div className="grid justify-start">
          <h1 className="py-4 text-2xl">{content}</h1>
        </div>
      </div>
    </div>
  );
}
