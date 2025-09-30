
import React from 'react';
import Modal from 'react-modal';
import { X } from 'lucide-react';
import { Button } from './ui/button';

Modal.setAppElement('#root');

const VideoModal = ({ isOpen, onRequestClose, videoUrl }) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Video Demo"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      overlayClassName="fixed inset-0 bg-black/80 z-40"
    >
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl w-full max-w-4xl aspect-video shadow-2xl overflow-hidden">
        <div className="absolute top-4 right-4 z-20">
          <Button
            variant="ghost"
            size="icon"
            onClick={onRequestClose}
            className="text-white hover:text-white/80 rounded-full bg-black/50 hover:bg-black/70"
          >
            <X className="w-6 h-6" />
            <span className="sr-only">Cerrar</span>
          </Button>
        </div>
        <iframe
          className="w-full h-full"
          src={videoUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    </Modal>
  );
};

export default VideoModal;
