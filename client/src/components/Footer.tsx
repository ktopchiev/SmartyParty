import { Container, Navbar } from 'react-bootstrap';

export default function Footer() {
    return (
        <Navbar
            sticky="bottom"
            style={{ backgroundColor: '#212529' }} // Dark background explicitly set
            className="shadow-sm py-3 mt-3"
        >
            <Container className="justify-content-center">
                <small style={{ color: '#f8f9fa' }}>
                    © {new Date().getFullYear()} SmartyParty - AI Powered, All Rights Reserved
                </small>
            </Container>
        </Navbar>
    );
}
