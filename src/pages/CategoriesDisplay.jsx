import { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CategoriesDisplay() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/categories/');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate('/products', { state: { category: categoryName } });
  };

  return (
    <div style={{ backgroundColor: '#e2e8f0', minHeight: '100vh' }}>
      <Container className="py-4">
        <h2 className="mb-4" style={{ color: '#1a202c', fontWeight: '600' }}>Categories</h2>
        <Row className="g-4">
          {categories.map((category) => (
            <Col key={category.category_id} xs={12} sm={6} md={4} lg={3}>
              <Card 
                className="h-100 shadow-sm"
                style={{ 
                  backgroundColor: '#f1f5f9',
                  borderRadius: '10px',
                  border: 'none',
                  transition: 'transform 0.2s',
                  cursor: 'pointer'
                }}
                onClick={() => handleCategoryClick(category.category_name)}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                border="success"
              >
                <Card.Body className="d-flex align-items-center justify-content-center">
                  <Card.Title 
                    className="text-center mb-0"
                    style={{ 
                      color: '#1a202c',
                      fontSize: '1.1rem',
                      fontWeight: '500'
                    }}
                  >
                    {category.category_name}
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default CategoriesDisplay;