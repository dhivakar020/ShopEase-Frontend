import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, Form, Button, Container, Alert } from 'react-bootstrap';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" 
      style={{ minHeight: "100vh", background: "#F0F4F8" }}>
      <Card style={{ width: '400px' }} className="shadow-lg">
        <Card.Body className="p-5">
          <h2 className="text-center mb-4" style={{ color: '#2C3E50' }}>Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="p-2"
                style={{ backgroundColor: '#F8FAFC' }}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="p-2"
                style={{ backgroundColor: '#F8FAFC' }}
              />
            </Form.Group>
            <Button 
              type="submit" 
              className="w-100 mb-4 p-2"
              style={{ 
                backgroundColor: '#3B82F6',
                border: 'none',
                fontSize: '1.1rem'
              }}
            >
              Login
            </Button>
          </Form>
          <div className="text-center">
            <Link 
              to="/signup" 
              style={{ color: '#3B82F6', textDecoration: 'none' }}
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginPage;