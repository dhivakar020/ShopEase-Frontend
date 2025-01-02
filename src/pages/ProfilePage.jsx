import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Spinner, Accordion } from 'react-bootstrap';
import { User, Package, Calendar, Mail, Clock } from 'lucide-react';
import axios from 'axios';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [profileRes, ordersRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/users/getProfile/', { headers }),
        axios.get('http://127.0.0.1:8000/orders/getOrders/', { headers })
      ]);
      
      setProfile(profileRes.data.profile);
      setOrders(ordersRes.data.orders);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" role="status" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col lg={4} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Body>
              <div className="text-center mb-4">
                <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center" 
                     style={{ width: '100px', height: '100px' }}>
                  <User size={40} color="white" />
                </div>
                <h4 className="mt-3 mb-1">{profile.email}</h4>
                <Badge bg="info" className="text-capitalize">{profile.role}</Badge>
              </div>
              
              <div className="border-top pt-3">
                <div className="d-flex align-items-center mb-3">
                  <Mail size={18} className="text-muted me-2" />
                  <div>
                    <small className="text-muted d-block">Email</small>
                    <span>{profile.email}</span>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <Calendar size={18} className="text-muted me-2" />
                  <div>
                    <small className="text-muted d-block">Member Since</small>
                    <span>{formatDate(profile.created_at)}</span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center mb-4">
                <Package size={24} className="text-primary me-2" />
                <h4 className="mb-0">Order History</h4>
              </div>

              <Accordion>
                {orders.map((order, index) => (
                  <Accordion.Item key={order.order_id} eventKey={index.toString()}>
                    <Accordion.Header>
                      <div className="d-flex justify-content-between align-items-center w-100 me-3">
                        <div>
                          <strong>Order #{order.order_id}</strong>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <Badge bg={order.order_status === 'pending' ? 'warning' : 'success'}>
                            {order.order_status}
                          </Badge>
                          <span className="text-muted">{formatPrice(order.total_price)}</span>
                        </div>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="mb-3">
                        <small className="text-muted d-flex align-items-center mb-2">
                          <Clock size={14} className="me-1" />
                          Ordered on {formatDate(order.order_date)}
                        </small>
                        <small className="text-muted d-block mb-3">
                          Shipping to: {order.shipping_address}
                        </small>
                      </div>
                      
                      <Table responsive className="mb-0">
                        <thead className="bg-light">
                          <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item, itemIndex) => (
                            <tr key={itemIndex}>
                              <td>{item.product_name}</td>
                              <td>{item.quantity}</td>
                              <td>{formatPrice(item.price)}</td>
                              <td>{formatPrice(item.total_price)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;