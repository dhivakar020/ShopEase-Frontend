import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, Form, Button, Container, Alert } from 'react-bootstrap';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await signup(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating account');
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" 
      style={{ minHeight: "100vh", background: "#F0F4F8" }}>
      <Card style={{ width: '400px' }} className="shadow-lg">
        <Card.Body className="p-5">
          <h2 className="text-center mb-4" style={{ color: '#2C3E50' }}>Sign Up</h2>
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
            <Form.Group className="mb-4">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              Sign Up
            </Button>
          </Form>
          <div className="text-center">
            <Link 
              to="/login" 
              style={{ color: '#3B82F6', textDecoration: 'none' }}
            >
              Already have an account? Login
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SignupPage;