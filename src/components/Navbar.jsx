import { useState } from 'react';
import { Navbar, Container, Nav, Form, Button, Badge } from 'react-bootstrap';
import { ShoppingCart, User, LogOut, Search, Home, LayoutGrid } from 'lucide-react';

function NavbarComponent() {
  const [cartCount, setCartCount] = useState(0);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm py-2">
      <Container fluid>
        <Navbar.Brand 
          href="#" 
          className="fw-bold fs-4 me-4"
          style={{ 
            background: 'linear-gradient(45deg, #3182ce, #63b3ed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          ShopEase
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="navbarScroll" />
        
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto">
            <Nav.Link href="/" className="d-flex align-items-center me-3">
              <Home size={18} className="me-2" />
              Home
            </Nav.Link>
            <Nav.Link href="/categories" className="d-flex align-items-center">
              <LayoutGrid size={18} className="me-2" />
              Categories
            </Nav.Link>
          </Nav>

          <Form className="d-flex mx-lg-4 my-2 my-lg-0">
            <div className="position-relative d-flex">
              <style>
                {`
                  .custom-search::placeholder {
                    color: rgba(255, 255, 255, 0.5) !important;
                    opacity: 1;
                  }
                  .custom-search:focus::placeholder {
                    color: rgba(255, 255, 255, 0.35) !important;
                  }
                  .custom-search {
                    color: rgba(255, 255, 255, 0.9) !important;
                  }
                  .custom-search:focus {
                    background-color: #1a202c !important;
                    border-color: #4299e1 !important;
                    box-shadow: 0 0 0 1px #4299e1 !important;
                  }
                `}
              </style>
              <Form.Control
                type="search"
                placeholder="Search products..."
                className="me-2 custom-search"
                aria-label="Search"
                style={{
                  borderRadius: '20px',
                  minWidth: '250px',
                  backgroundColor: '#1a202c',
                  border: '1px solid #4a5568',
                  height: '40px',
                  paddingLeft: '1rem',
                  paddingRight: '3rem',
                  fontSize: '0.95rem',
                }}
              />
              <Button 
                variant="link" 
                className="position-absolute text-light border-0"
                style={{
                  right: '8px',
                  top: '0',
                  bottom: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 12px',
                  backgroundColor: 'transparent'
                }}
              >
                <Search size={18} style={{ opacity: 0.7 }} />
              </Button>
            </div>
          </Form>

          <Nav className="ms-auto d-flex align-items-center">
            <Nav.Link 
              href="/cart" 
              className="d-flex align-items-center me-3 position-relative"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <Badge 
                  bg="primary" 
                  className="position-absolute translate-middle"
                  style={{ 
                    top: '0px', 
                    right: '-8px',
                    fontSize: '0.7rem',
                    padding: '0.25em 0.4em'
                  }}
                >
                  {cartCount}
                </Badge>
              )}
            </Nav.Link>

            <Nav.Link 
              href="/profile" 
              className="d-flex align-items-center me-3"
            >
              <User size={20} />
            </Nav.Link>

            <Button 
              variant="outline-light" 
              className="d-flex align-items-center ps-3 pe-3"
              style={{
                borderRadius: '20px',
                borderWidth: '1.5px',
                height: '40px'
              }}
            >
              <LogOut size={18} className="me-2" />
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;