import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, ButtonGroup } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { Plus, Minus } from 'lucide-react';
import axios from 'axios';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [cartQuantities, setCartQuantities] = useState({});
  const [loadingProducts, setLoadingProducts] = useState({});
  const location = useLocation();
  const category = location.state?.category;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/getProduct/?category=${encodeURIComponent(category)}`);
        setProducts(response.data);
        fetchCartItems();
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    if (category) {
      fetchProducts();
    }
  }, [category]);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://127.0.0.1:8000/cart/getCartItems/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const quantities = {};
      response.data.cart_items.forEach(item => {
        quantities[item.product_id] = item.quantity;
      });
      setCartQuantities(quantities);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const updateCart = async (productId, quantityChange) => {
    setLoadingProducts(prev => ({ ...prev, [productId]: true }));
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post('http://127.0.0.1:8000/cart/addToCart/',
        {
          product_id: productId,
          quantity: quantityChange
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setCartQuantities(prev => ({
        ...prev,
        [productId]: response.data.cart_item.quantity
      }));
    } catch (error) {
      console.error('Error updating cart:', error);
    } finally {
      setLoadingProducts(prev => ({ ...prev, [productId]: false }));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const renderCartButton = (product) => {
    const quantity = cartQuantities[product.product_id] || 0;
    const isLoading = loadingProducts[product.product_id];

    if (quantity > 0) {
      return (
        <ButtonGroup className="w-100">
          <Button
            variant="success"
            className="w-25"
            onClick={() => updateCart(product.product_id, -1)}
            disabled={isLoading}
            style={{
              background: '#38a169',
              border: 'none',
              borderTopLeftRadius: '0.75rem',
              borderBottomLeftRadius: '0.75rem',
              transition: 'all 0.3s ease',
            }}
          >
            <Minus size={16} />
          </Button>
          <Button
            variant="success"
            className="w-50 position-relative"
            disabled={isLoading}
            style={{
              background: '#38a169',
              border: 'none',
              borderRadius: '0',
              transition: 'all 0.3s ease',
            }}
          >
            {isLoading ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              <>In Cart: {quantity}</>
            )}
          </Button>
          <Button
            variant="success"
            className="w-25"
            onClick={() => updateCart(product.product_id, 1)}
            disabled={isLoading}
            style={{
              background: '#38a169',
              border: 'none',
              borderTopRightRadius: '0.75rem',
              borderBottomRightRadius: '0.75rem',
              transition: 'all 0.3s ease',
            }}
          >
            <Plus size={16} />
          </Button>
        </ButtonGroup>
      );
    }

    return (
      <Button 
        variant="primary"
        className="w-100 py-2"
        onClick={() => updateCart(product.product_id, 1)}
        disabled={isLoading}
        style={{
          background: hoveredProduct === product.product_id 
            ? 'linear-gradient(45deg, #2b6cb0, #3182ce)' 
            : '#2b6cb0',
          border: 'none',
          borderRadius: '0.75rem',
          fontWeight: '500',
          transition: 'all 0.3s ease',
          boxShadow: hoveredProduct === product.product_id 
            ? '0 4px 12px rgba(49, 130, 206, 0.3)'
            : 'none'
        }}
      >
        {isLoading ? (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            className="me-2"
          />
        ) : (
          'Add to Cart'
        )}
      </Button>
    );
  };

  return (
    <div style={{ 
      background: 'linear-gradient(to bottom, #e8edf3, #f8fafc)',
      minHeight: '100vh',
      paddingBottom: '2rem'
    }}>
      <Container fluid className="px-4 py-5">
        <h1 className="text-center mb-5" style={{ 
          color: '#1a365d', 
          fontWeight: '700',
          fontSize: '2.5rem',
          borderBottom: '3px solid #3182ce',
          paddingBottom: '0.5rem',
          display: 'inline-block',
          marginLeft: '1rem'
        }}>
          {category}
        </h1>
        
        <Row className="g-4 px-3">
          {products.map((product) => (
            <Col key={product.product_id} xs={12} sm={6} md={4} xl={3}>
              <Card 
                className="h-100"
                style={{
                  transform: hoveredProduct === product.product_id ? 'translateY(-8px)' : 'none',
                  transition: 'all 0.3s ease-in-out',
                  boxShadow: hoveredProduct === product.product_id 
                    ? '0 12px 24px rgba(0,0,0,0.15)' 
                    : '0 4px 12px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(226, 232, 240, 0.8)',
                  borderRadius: '1rem',
                  backgroundColor: '#ffffff',
                }}
                onMouseEnter={() => setHoveredProduct(product.product_id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div className="position-relative">
                  <Card.Img 
                    variant="top" 
                    src={`http://127.0.0.1:8000${product.product_image}`}
                    alt={product.product_name}
                    style={{ 
                      height: '280px', 
                      objectFit: 'cover',
                      borderTopLeftRadius: '1rem',
                      borderTopRightRadius: '1rem',
                      backgroundColor: '#f7fafc'
                    }}
                  />
                  {product.stock_quantity < 100 && (
                    <Badge 
                      bg="danger" 
                      className="position-absolute top-0 end-0 m-3 px-3 py-2"
                      style={{ 
                        borderRadius: '0.5rem',
                        fontSize: '0.8rem',
                        fontWeight: '500'
                      }}
                    >
                      Low Stock
                    </Badge>
                  )}
                </div>

                <Card.Body className="d-flex flex-column p-4" style={{ backgroundColor: '#ffffff' }}>
                  <Card.Title 
                    className="mb-3"
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: '#2d3748',
                      height: '3rem',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {product.product_name}
                  </Card.Title>

                  <Card.Text 
                    className="flex-grow-1"
                    style={{
                      color: '#4a5568',
                      fontSize: '0.95rem',
                      maxHeight: '4.5rem',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      marginBottom: '1.5rem'
                    }}
                  >
                    {product.description}
                  </Card.Text>

                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="fs-4 fw-bold" style={{ color: '#2b6cb0' }}>
                        {formatPrice(product.price)}
                      </span>
                      <span style={{ color: '#718096', fontSize: '0.9rem' }}>
                        Stock: {product.stock_quantity}
                      </span>
                    </div>
                    
                    {renderCartButton(product)}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default ProductsPage;