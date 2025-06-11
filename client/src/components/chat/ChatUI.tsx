import { useState } from 'react';
import { Modal, Button, Badge } from 'react-bootstrap';
import { ChatDots } from 'react-bootstrap-icons';
import ChatWindow from './ChatWindow';
import { useParams } from 'react-router';

function ChatUI() {
    const [showModal, setShowModal] = useState(false);
    const [unreadCount, setUnreadCount] = useState(3);
    const { roomId } = useParams<{ roomId: string }>();

    const openChat = () => {
        setShowModal(true);
        setUnreadCount(0);
    };

    const closeChat = () => setShowModal(false);

    return (
        <>
            <div className="d-none d-md-block border p-3">
                <ChatWindow roomId={roomId!} />
            </div>

            <Button
                variant="primary"
                className="rounded-circle position-fixed d-md-none"
                style={{
                    bottom: '60px',
                    right: '20px',
                    width: '50px',
                    height: '50px',
                    zIndex: 1050,
                }}
                onClick={openChat}
            >
                <ChatDots size={24} />
                {unreadCount > 0 && (
                    <Badge
                        pill
                        bg="danger"
                        className="position-absolute top-0 start-100 translate-middle"
                        style={{ fontSize: '0.7rem' }}
                    >
                        {unreadCount}
                    </Badge>
                )}
            </Button>

            <Modal
                show={showModal}
                onHide={closeChat}
                centered
                dialogClassName="chat-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Chat</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ChatWindow roomId={roomId!} />
                </Modal.Body>
            </Modal>

            <style>{`
        @media (max-width: 768px) {
          .modal.chat-modal .modal-dialog {
            width: 80% !important;
            max-width: none;
            margin: auto;
          }
        }
      `}</style>
        </>
    );
}

export default ChatUI;
