import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Image, Spinner, Form, Alert } from 'react-bootstrap';
import { Trash2, Plus, Minus, CheckCircle } from 'lucide-react';
import axios from 'axios';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingItems, setLoadingItems] = useState({});
  const [shippingAddress, setShippingAddress] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://127.0.0.1:8000/cart/getCartItems/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCartItems(response.data.cart_items);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantityChange) => {
    setLoadingItems(prev => ({ ...prev, [productId]: true }));
    try {
      const token = localStorage.getItem('access_token');
      await axios.post(
        'http://127.0.0.1:8000/cart/addToCart/',
        { product_id: productId, quantity: quantityChange },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      await fetchCartItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setLoadingItems(prev => ({ ...prev, [productId]: false }));
    }
  };

  const placeOrder = async () => {
    if (!shippingAddress.trim()) {
      alert('Please enter a shipping address');
      return;
    }
    setPlacing(true);
    try {
      const token = localStorage.getItem('access_token');
      await axios.post(
        'http://127.0.0.1:8000/orders/makeOrder/',
        { shipping_address: shippingAddress },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setOrderSuccess(true);
      setCartItems([]);
      setShippingAddress('');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.total_price, 0);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" role="status" variant="primary" />
      </Container>
    );
  }

  if (orderSuccess) {
    return (
      <Container className="py-5">
        <Card className="text-center p-5 shadow-sm">
          <Card.Body className="d-flex flex-column align-items-center">
            <CheckCircle size={64} className="text-success mb-4" />
            <h2 className="mb-3" style={{ color: '#2d3748' }}>Order Placed Successfully!</h2>
            <p className="text-muted mb-4">Thank you for your purchase.</p>
            <Button 
              href="/categories" 
              variant="primary"
              style={{
                background: 'linear-gradient(45deg, #2b6cb0, #3182ce)',
                border: 'none',
                padding: '0.75rem 2rem'
              }}
            >
              Continue Shopping
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Container className="py-5">
        <Card className="text-center p-5 shadow-sm">
          <Card.Body>
            <h2 className="mb-4" style={{ color: '#2d3748' }}>Your cart is empty</h2>
            <p className="text-muted mb-4">Looks like you haven't added any items to your cart yet.</p>
            <Button 
              href="/categories" 
              variant="primary"
              style={{
                background: 'linear-gradient(45deg, #2b6cb0, #3182ce)',
                border: 'none',
                padding: '0.75rem 2rem'
              }}
            >
              Continue Shopping
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4" style={{ color: '#2d3748', fontWeight: '600' }}>Shopping Cart</h1>
      
      <Row>
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Table responsive className="align-middle">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.product_id}>
                      <td style={{ minWidth: '300px' }}>
                        <div className="d-flex align-items-center">
                          <Image
                            src={`http://127.0.0.1:8000${item.product_image}`}
                            alt={item.product_name}
                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                            className="me-3"
                          />
                          <div>
                            <h6 className="mb-1">{item.product_name}</h6>
                            <small className="text-muted">{item.description}</small>
                          </div>
                        </div>
                      </td>
                      <td>{formatPrice(item.price)}</td>
                      <td style={{ width: '150px' }}>
                        <div className="d-flex align-items-center">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => updateQuantity(item.product_id, -1)}
                            disabled={loadingItems[item.product_id] || item.quantity <= 1}
                            className="me-2"
                          >
                            <Minus size={14} />
                          </Button>
                          <span className="mx-2">
                            {loadingItems[item.product_id] ? (
                              <Spinner animation="border" size="sm" />
                            ) : (
                              item.quantity
                            )}
                          </span>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => updateQuantity(item.product_id, 1)}
                            disabled={loadingItems[item.product_id]}
                            className="ms-2"
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                      </td>
                      <td>{formatPrice(item.total_price)}</td>
                      <td>
                        <Button
                          variant="link"
                          className="text-danger p-0"
                          onClick={() => updateQuantity(item.product_id, -item.quantity)}
                          disabled={loadingItems[item.product_id]}
                        >
                          <Trash2 size={18} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-4">Order Summary</h5>
              <div className="d-flex justify-content-between mb-3">
                <span>Subtotal</span>
                <span>{formatPrice(calculateTotal())}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Shipping</span>
                <span className="text-success">Free</span>
              </div>
              <hr />
              <Form.Group className="mb-4">
                <Form.Label>Shipping Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Enter your complete shipping address"
                  required
                />
              </Form.Group>
              <div className="d-flex justify-content-between mb-4">
                <strong>Total</strong>
                <strong>{formatPrice(calculateTotal())}</strong>
              </div>
              <Button
                variant="primary"
                className="w-100 py-2"
                onClick={placeOrder}
                disabled={placing || !shippingAddress.trim()}
                style={{
                  background: 'linear-gradient(45deg, #2b6cb0, #3182ce)',
                  border: 'none',
                  borderRadius: '0.5rem'
                }}
              >
                {placing ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Placing Order...
                  </>
                ) : (
                  'Place Order'
                )}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;