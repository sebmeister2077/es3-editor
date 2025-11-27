import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import JSONEditor from 'jsoneditor';
import { useRef, useEffect, useCallback, useState } from 'react';
import 'jsoneditor/dist/jsoneditor.min.css';

import Footer from './footer';
import { EditorData } from './cryptForm';

type Props = {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isOpen: boolean;
  onClose: () => void;
  data: EditorData | null;
  setData: (data: EditorData | null) => void;
  saveData: () => Promise<boolean>;
};
export default function Editor({ isLoading, setIsLoading, isOpen, onClose, data, setData, saveData }: Props) {
  const editorContainer = useRef<HTMLDivElement | null>(null);
  const [editor, setEditor] = useState<JSONEditor | null>(null);

  useEffect(() => {
    if (!editorContainer.current || !data) return;

    const editor = new JSONEditor(editorContainer.current, {
      mode: isLoading ? 'view' : 'tree',
      onChangeText: (newData) => {
        setData({ ...data, data: Buffer.from(newData) });
      },
    });

    setEditor(editor);
    editor.set(JSON.parse(data.data?.toString() ?? '{}'));

    return () => {
      setEditor(null);
      editor.destroy();
    };
  }, [editorContainer]);

  useEffect(() => {
    if (!editor) return;

    editor.setMode(isLoading ? 'view' : 'tree');
  }, [isLoading]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editor</ModalHeader>
        <ModalBody mt="5">
          <div ref={editorContainer}></div>
        </ModalBody>
        <ModalFooter>
          <Footer left />
          <Button
            colorScheme="orange"
            isDisabled={isLoading}
            onClick={async () => {
              setIsLoading(true);

              const isSaveSuccess = await saveData();
              setIsLoading(false);

              if (isSaveSuccess) onClose();
            }}
          >
            Save
          </Button>
          <Button
            ml="3"
            onClick={() => {
              setData(null);
              onClose();
            }}
            isDisabled={isLoading}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
