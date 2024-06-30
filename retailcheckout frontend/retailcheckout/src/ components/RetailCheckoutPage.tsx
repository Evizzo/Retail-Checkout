import { useState, useEffect, ChangeEvent } from 'react';
import { Container, Card, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import ArticleTable, { Article } from './ArticleTable';
import { executeSaveBill, executeRetrieveStoreArticles } from '../api/ApiService';
import { Link } from 'react-router-dom';
import { useAuth } from '../api/AuthContex';

function RetailCheckoutPage() {
  const [serialNumber, setSerialNumber] = useState('');
  const [articleName, setArticleName] = useState('');
  const [quantity, setQuantity] = useState<string | number>('');
  const [price, setPrice] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [articles, setArticles] = useState<Article[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [showPaymentSection, setShowPaymentSection] = useState(false);
  const [paidBy, setPaidBy] = useState<'CASH' | 'CARD' | null>(null);
  const [amountGivenToCashier, setAmountGivenToCashier] = useState<number | string>('');
  const [change, setChange] = useState<number | null>(null);
  const [availableArticles, setAvailableArticles] = useState<{ articleName: string, serialNumber: string, price: number, quantityAvailable: number }[]>([]);
  const [selectedStoreArticle, setSelectedStoreArticle] = useState<{ articleName: string, serialNumber: string, price: number, quantityAvailable: number } | null>(null);
  const authContext = useAuth();

  useEffect(() => {
    executeRetrieveStoreArticles()
      .then(response => {
        setAvailableArticles(response.data);
      })
      .catch(error => {
        console.error('Error fetching store articles:', error);
      });
  }, [articles]);

  useEffect(() => {
    calculateTotal();
  }, [articles]);

  const handleSerialNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSerialNumber(e.target.value);
  };

  const handleArticleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedArticleInfo = e.target.value;
    const selectedArticleName = selectedArticleInfo.split(' (')[0];
    const selectedArticle = availableArticles.find(article => article.articleName === selectedArticleName);
    if (selectedArticle) {
      setArticleName(selectedArticleInfo);
      setSerialNumber(selectedArticle.serialNumber);
      setPrice(selectedArticle.price.toString());
      setSelectedStoreArticle(selectedArticle);
    }
  };

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = Number(value);
  
    if (selectedStoreArticle && numValue > selectedStoreArticle.quantityAvailable) {
      alert(`Quantity cannot exceed ${selectedStoreArticle.quantityAvailable}`);
      setQuantity(selectedStoreArticle.quantityAvailable);
    } else {
      setQuantity(value === '' ? '' : numValue);
    }
  };
  

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
  };

  const handleAddArticle = () => {
    if (Number(price) <= 0 || Number(quantity) <= 0) {
      alert('Price and Quantity must be positive numbers.');
      return;
    }

    if (Number(quantity) < 1) {
      alert('Quantity should be at least 1.');
      return;
    }

    if (serialNumber.trim() === '' || articleName.trim() === '' || price.trim() === '' || quantity === '') {
      alert('Please fill in all fields.');
      return;
    }

    if (selectedStoreArticle && Number(quantity) > selectedStoreArticle.quantityAvailable) {
      alert(`Quantity cannot exceed ${selectedStoreArticle.quantityAvailable}`);
      return;
    }

    if (serialNumber.trim() !== '' && articleName.trim() !== '' && price.trim() !== '') {
      const newArticle: Article = { serialNumber, 
        articleName: articleName, 
        quantity: Number(quantity), 
        pricePerItem: Number(price),
        storeArticle: selectedStoreArticle
      };
      if (editIndex !== null) {
        const updatedArticles = [...articles];
        updatedArticles[editIndex] = newArticle;
        setArticles(updatedArticles);
        setEditIndex(null);
      } else {
        setArticles([...articles, newArticle]);
      }
      setSerialNumber('');
      setArticleName('');
      setQuantity('');
      setPrice('');
      setSelectedStoreArticle(null);
    }
  };

  const handleEditArticle = (index: number) => {
    const article = articles[index];
    setSerialNumber(article.serialNumber);
    setArticleName(article.articleName);
    setQuantity(article.quantity.toString());
    setPrice(article.pricePerItem.toString());
    setEditIndex(index);
  };

  const handleDeleteArticle = (index: number) => {
    const updatedArticles = [...articles];
    updatedArticles.splice(index, 1);
    setArticles(updatedArticles);
    setEditIndex(null);
  };

  const handleProceedToPayment = () => {
    if (articles.length === 0) {
      alert('No articles added. Please add at least one article.');
      return;
    }
    setShowPaymentSection(true);
  };

  const handlePaymentMethodSelection = (method: 'CASH' | 'CARD') => {
    setPaidBy(method);
  };

  const handleGoBack = () => {
    setShowPaymentSection(false);
  };

  const handleAmountGivenChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmountGivenToCashier(value === '' ? '' : Number(value));
  };

  const handlePaymentSubmission = async () => {
    if (!paidBy) {
      alert("Please select a payment method.");
      return;
    }

    try {
      const bill = {
        articles,
        paidBy,
        totalPrice,
        amountGivenToCashier: amountGivenToCashier === '' ? 0 : Number(amountGivenToCashier)
      };
      const response = await executeSaveBill(bill);
      console.log("Bill saved successfully:", response.data);

      alert('Bill paid successfully.');

      setArticles([]);
      setSerialNumber('');
      setArticleName('');
      setQuantity('');
      setPrice('');
      setPaidBy(null);
      setShowPaymentSection(false);
      setAmountGivenToCashier('');
      setChange(null);
      setTotalPrice(0);
    } catch (error) {
      console.error("Error saving bill:", error);
    }
  };

  const calculateTotal = () => {
    let total = 0;
    articles.forEach(article => {
      const articleTotal = article.pricePerItem * article.quantity;
      total += articleTotal;
    });
    setTotalPrice(total);
  };

  const calculateChange = () => {
    const total = totalPrice;
    const givenAmount = typeof amountGivenToCashier === 'number' ? amountGivenToCashier : parseFloat(amountGivenToCashier);

    if (isNaN(givenAmount)) {
      alert('Invalid amount given. Please enter a valid number.');
      setChange(null);
      return;
    }

    if (givenAmount >= total) {
      setChange(givenAmount - total);
      setAmountGivenToCashier(givenAmount);
    } else {
      alert('Amount given is less than the total amount due.');
      setChange(null);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card className="bg-light p-4 text-center" style={{ width: '100%', maxWidth: '800px' }}>
        <Container>
          <h1>Welcome {authContext.username}!</h1>
          <Button variant="secondary" type="button" onClick={authContext.logout}>
            Logout
          </Button>
          <br />
          <p>Total: ${totalPrice.toFixed(2)}</p>
          {!showPaymentSection ? (
            <Form>
              <Form.Group controlId="formArticleName">
                <Form.Label>Article Name ({selectedStoreArticle?.quantityAvailable})</Form.Label>
                <br></br>
                <Form.Select className="mb-3"
                  onChange={handleArticleSelectChange}
                  value={articleName}
                  required
                  style={{ width: '23%' }}
                >
                  <option value="">Select an article...</option>
                  {availableArticles.map(article => (
                    <option key={article.serialNumber} value={article.articleName}>
                      {article.articleName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="formSerialNumber">
                <Form.Label>Serial Number</Form.Label>
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="Serial number"
                    value={serialNumber}
                    onChange={handleSerialNumberChange}
                    required
                    disabled={true}
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="formQuantity">
                <Form.Label>Quantity</Form.Label>
                <InputGroup className="mb-3">
                  <FormControl
                    type="number"
                    placeholder="Enter quantity"
                    value={quantity}
                    onChange={handleQuantityChange}
                    required
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="formPrice">
                <Form.Label>Price</Form.Label>
                <InputGroup className="mb-3">
                  <FormControl
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={handlePriceChange}
                    required
                    disabled={true}
                  />
                </InputGroup>
              </Form.Group>
              <br />
              <Button variant="primary" onClick={handleAddArticle}>
                {editIndex !== null ? 'Edit' : 'Add'}
              </Button>
              <br /><br />
              <ArticleTable articles={articles} onEdit={handleEditArticle} onDelete={handleDeleteArticle} />
              <br />
              <Button variant="primary" type="button" onClick={handleProceedToPayment}>
                Proceed to Payment
              </Button>
              <br /><br />
              <Link to="/cashiers-bills">
                <Button variant="secondary">
                  View Your Bills
                </Button>
              </Link>
            </Form>
          ) : (
            <div>
              <h3>Choose Payment Method</h3>
              <fieldset>
                <Form.Group>
                  <Form.Check
                    type="radio"
                    label="Cash"
                    name="paymentMethod"
                    id="cash"
                    onChange={() => handlePaymentMethodSelection('CASH')}
                  />
                  <Form.Check
                    type="radio"
                    label="Card"
                    name="paymentMethod"
                    id="card"
                    onChange={() => handlePaymentMethodSelection('CARD')}
                  />
                </Form.Group>
              </fieldset>
              <br />
              {paidBy === 'CASH' && (
                <div>
                  <Form.Group controlId="formAmountGiven">
                    <Form.Label>Amount Given</Form.Label>
                    <InputGroup className="mb-3">
                      <FormControl
                        type="number"
                        placeholder="Enter amount given"
                        value={amountGivenToCashier}
                        onChange={handleAmountGivenChange}
                      />
                    </InputGroup>
                  </Form.Group>
                  <Button variant="primary" type="button" onClick={calculateChange}>
                    Calculate Change
                  </Button>
                  <br /><br />
                  {change !== null && <p>Change: ${change.toFixed(2)}</p>}
                </div>
              )}
              <Button variant="primary" type="button" onClick={handlePaymentSubmission}>
                Submit Payment
              </Button>
              <br /><br />
              <Button variant="secondary" type="button" onClick={handleGoBack}>
                Go Back
              </Button>
            </div>
          )}
        </Container>
      </Card>
    </div>
  );
}

export default RetailCheckoutPage;
