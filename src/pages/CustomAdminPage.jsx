import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, X, Check, Loader2 } from 'lucide-react';

const CustomAdminPage = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [isCreating, setIsCreating] = useState(false);
  const [newProduct, setNewProduct] = useState({
    product_name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category_id: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:8000/api/products/');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const validProducts = data.filter(product => product && product.product_id);
      setProducts(validProducts);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch products: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.product_id);
    setEditedProduct({
      product_name: product.product_name,
      description: product.description,
      price: product.price,
      stock_quantity: product.stock_quantity,
      category_id: product.category?.category_id || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedProduct({});
  };

  const handleSaveEdit = async () => {
    try {
      const payload = {
        product_name: editedProduct.product_name,
        description: editedProduct.description,
        price: Number(editedProduct.price),
        stock_quantity: Number(editedProduct.stock_quantity),
        category_id: Number(editedProduct.category_id)
      };

      const response = await fetch(`http://127.0.0.1:8000/api/products/${editingId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      await fetchProducts();
      setEditingId(null);
      setEditedProduct({});
    } catch (err) {
      console.error('Update error:', err);
      setError('Failed to update product: ' + err.message);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/products/${productId}/`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        await fetchProducts();
      } catch (err) {
        console.error('Delete error:', err);
        setError('Failed to delete product: ' + err.message);
      }
    }
  };

  const handleCreateProduct = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/products/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      await fetchProducts();
      setIsCreating(false);
      setNewProduct({
        product_name: '',
        description: '',
        price: '',
        stock_quantity: '',
        category_id: ''
      });
    } catch (err) {
      console.error('Create error:', err);
      setError('Failed to create product: ' + err.message);
    }
  };

  const getCategoryName = (product) => {
    return product.category?.category_name || 'Uncategorized';
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">Product Management</h1>
        <button 
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => setIsCreating(!isCreating)}
        >
          {isCreating ? <X size={18} /> : <Plus size={18} />}
          {isCreating ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {isCreating && (
        <div className="card mb-4">
          <div className="card-body">
            <h2 className="card-title h5 mb-3">Create New Product</h2>
            <div className="row g-3">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Product Name"
                  value={newProduct.product_name}
                  onChange={(e) => setNewProduct({...newProduct, product_name: e.target.value})}
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                />
              </div>
              <div className="col-md-4">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                />
              </div>
              <div className="col-md-4">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Stock Quantity"
                  value={newProduct.stock_quantity}
                  onChange={(e) => setNewProduct({...newProduct, stock_quantity: e.target.value})}
                />
              </div>
              <div className="col-md-4">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Category ID"
                  value={newProduct.category_id}
                  onChange={(e) => setNewProduct({...newProduct, category_id: e.target.value})}
                />
              </div>
            </div>
            <button 
              className="btn btn-primary mt-3"
              onClick={handleCreateProduct}
            >
              Create Product
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center p-5">
          <Loader2 className="spinner-border" size={32} />
        </div>
      ) : products.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.product_id}>
                  <td>{product.product_id}</td>
                  <td>
                    {editingId === product.product_id ? (
                      <input
                        type="text"
                        className="form-control"
                        value={editedProduct.product_name || ''}
                        onChange={(e) => setEditedProduct({
                          ...editedProduct,
                          product_name: e.target.value
                        })}
                      />
                    ) : (
                      product.product_name
                    )}
                  </td>
                  <td>
                    {editingId === product.product_id ? (
                      <input
                        type="text"
                        className="form-control"
                        value={editedProduct.description || ''}
                        onChange={(e) => setEditedProduct({
                          ...editedProduct,
                          description: e.target.value
                        })}
                      />
                    ) : (
                      product.description
                    )}
                  </td>
                  <td>
                    {editingId === product.product_id ? (
                      <input
                        type="number"
                        className="form-control"
                        value={editedProduct.price || ''}
                        onChange={(e) => setEditedProduct({
                          ...editedProduct,
                          price: e.target.value
                        })}
                      />
                    ) : (
                      `$${product.price}`
                    )}
                  </td>
                  <td>
                    {editingId === product.product_id ? (
                      <input
                        type="number"
                        className="form-control"
                        value={editedProduct.stock_quantity || ''}
                        onChange={(e) => setEditedProduct({
                          ...editedProduct,
                          stock_quantity: e.target.value
                        })}
                      />
                    ) : (
                      product.stock_quantity
                    )}
                  </td>
                  <td>{getCategoryName(product)}</td>
                  <td>
                    <div className="btn-group">
                      {editingId === product.product_id ? (
                        <>
                          <button
                            className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                            onClick={handleSaveEdit}
                          >
                            <Check size={16} />
                            Save
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                            onClick={handleCancelEdit}
                          >
                            <X size={16} />
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                          onClick={() => handleEdit(product)}
                        >
                          <Pencil size={16} />
                          Edit
                        </button>
                      )}
                      <button
                        className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                        onClick={() => handleDelete(product.product_id)}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="alert alert-info">No products found.</div>
      )}
    </div>
  );
};

export default CustomAdminPage;