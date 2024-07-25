import { useState, useEffect, ChangeEvent } from 'react';
import { Container, Card, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import ArticleTable, { Article } from './ArticleTable';
import { executeSaveBill, executeRetrieveStoreArticles, executeFindStoreArticleBySerialNumber, executeGetAvailablePoints, executeCodeRedeem } from '../api/ApiService';
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
  const [paidBy, setPaidBy] = useState<'CASH' | 'CARD' | 'SPLIT' | null>(null);
  const [amountGivenToCashier, setAmountGivenToCashier] = useState<number | string>('');
  const [change, setChange] = useState<number | null>(null);
  const [availableArticles, setAvailableArticles] = useState<{ articleName: string, serialNumber: string, price: number, quantityAvailable: number }[]>([]);
  const [selectedStoreArticle, setSelectedStoreArticle] = useState<{ articleName: string, serialNumber: string, price: number, quantityAvailable: number } | null>(null);
  const authContext = useAuth();
  const [changeCalculated, setChangeCalculated] = useState(false);
  const { cashInCheckout, updateCashInCheckout } = useAuth();
  const [loyaltyCode, setLoyaltyCode] = useState('');
  const [pointsToRedeem, setPointsToRedeem] = useState<number>(0);
  const [paidWithPoints, setPaidWithPoints] = useState<number>(0);
  const [cashAmount, setCashAmount] = useState<string>('');
  const [cardAmount, setCardAmount] = useState<string>('');
  
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

  const handleLoyaltyCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoyaltyCode(e.target.value);
  };

  const handlePointsToRedeemChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = Number(value);

    if (isNaN(numValue) || numValue < 0) {
        alert('Points to redeem cannot be negative or invalid.');
        setPointsToRedeem(0);
    } else {
        setPointsToRedeem(numValue);
    }
  };

  const handleGetAvailablePoints = async () => {
    try {
      const response = await executeGetAvailablePoints(loyaltyCode);
      alert(`Available points: ${response.data}`);
    } catch (error) {
      console.error('Error fetching available points:', error);
      alert('An error occurred while fetching available points.');
    }
  };

  const handleRedeemPoints = async () => {
    try {
      const response = await executeCodeRedeem(loyaltyCode, pointsToRedeem, totalPrice);
      setPaidWithPoints(prevPoints => prevPoints + response.data);
      alert(`Redeemed points: ${response.data}`);
      setTotalPrice(totalPrice - response.data);
    } catch (error) {
      console.error('Error redeeming points:', error);
      alert('An error occurred while redeeming points.');
    }
  };

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

  const searchArticle = async () => {
    try {
      const response = await executeFindStoreArticleBySerialNumber(serialNumber);
      const article = response.data;
      if (article) {
        setArticleName(article.articleName);
        setPrice(article.price.toString());
        setSelectedStoreArticle(article);
        const selectElement = document.querySelector('select') as HTMLSelectElement;
        if (selectElement) {
          selectElement.value = article.articleName;
          handleArticleSelectChange({ target: { value: article.articleName } } as ChangeEvent<HTMLSelectElement>);
        }
      } else {
        alert('Article not found.');
      }
    } catch (error) {
      console.error('Error fetching article by serial number:', error);
      alert('An error occurred while searching for the article.');
    }
  };

  const handleAddArticle = async () => {
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

    try {
      const response = await executeFindStoreArticleBySerialNumber(serialNumber);
      const article = response.data;
      if (!article) {
        alert('Article does not exist.');
        return;
      }

      const newArticle: Article = { 
        serialNumber, 
        articleName: article.articleName, 
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
    } catch (error) {
      console.error('Error adding article:', error);
      alert('An error occurred while adding the article.');
    }
  };

  const handleEditArticle = async (index: number) => {
    const article = articles[index];
    setSerialNumber(article.serialNumber);
    setArticleName(article.articleName);
    setQuantity(article.quantity.toString());
    setPrice(article.pricePerItem.toString());
    setSelectedStoreArticle(article.storeArticle);

    try {
      const response = await executeFindStoreArticleBySerialNumber(article.serialNumber);
      const fetchedArticle = response.data;
      if (fetchedArticle) {
        setSelectedStoreArticle(fetchedArticle);
      } else {
        alert('Article does not exist.');
      }
    } catch (error) {
      console.error('Error fetching article during edit:', error);
      alert('An error occurred while editing the article.');
    }
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

  const handlePaymentMethodSelection = (method: 'CASH' | 'CARD' | 'SPLIT') => {
    setPaidBy(method);
    setChangeCalculated(false);
    setCashAmount('');
    setCardAmount('');
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

    if (paidBy === 'CASH' && !changeCalculated) {
        alert("Please calculate the change before proceeding.");
        return;
    }

    if (paidBy === 'SPLIT' && !changeCalculated) {
      alert("Please calculate the change before proceeding.");
      return;
  }

    let cash = 0;
    let card = 0;

    if (paidBy === 'SPLIT') {
      cash = parseFloat(cashAmount);
      card = parseFloat(cardAmount);
  
      if (isNaN(cash)) cash = 0;
      if (isNaN(card)) card = 0;
      
      if (Math.abs((cash + card) - (totalPrice)) > 0.01) {
        alert('Invalid split amounts. The total should match the bill amount.');
        console.log(totalPrice)
        console.log(cash)
        console.log(card)
        return;
      }      
    }

    try {
        const bill = {
            articles,
            paidBy,
            totalPrice: totalPrice,
            amountGivenToCashier: (amountGivenToCashier === '' ? 0 : Number(amountGivenToCashier)),
            paidWithPoints,
            cashAmount: paidBy === 'SPLIT' ? cash : (paidBy === 'CASH' ? totalPrice : 0),
            cardAmount: paidBy === 'SPLIT' ? card : (paidBy === 'CARD' ? totalPrice : 0)
        };
        const response = await executeSaveBill(bill, loyaltyCode);
        console.log("Bill saved successfully:", response.data);

        if (paidBy === 'CASH' || paidBy === 'SPLIT') {
            const newCashInCheckout = cashInCheckout + (paidBy === 'SPLIT' ? cash : totalPrice);
            updateCashInCheckout(newCashInCheckout);
        }

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
        setLoyaltyCode('');
        setPointsToRedeem(0);
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
      setChangeCalculated(false);
      return;
    }
  
    if (paidBy === 'CASH' && givenAmount >= total) {
      const newChange = givenAmount - total;
  
      if (newChange > cashInCheckout) {
        alert(`Insufficient cash in the register to provide change. Current cash in checkout: $${cashInCheckout.toFixed(2)}`);
        setChange(null);
        setChangeCalculated(false);
        return;
      }
  
      setChange(newChange);
      setAmountGivenToCashier(givenAmount);
      setChangeCalculated(true);
    } else if (paidBy === 'SPLIT' && givenAmount >= parseFloat(cashAmount)) {
      const newChange = givenAmount - parseFloat(cashAmount);
  
      if (newChange > cashInCheckout) {
        alert(`Insufficient cash in the register to provide change. Current cash in checkout: $${cashInCheckout.toFixed(2)}`);
        setChange(null);
        setChangeCalculated(false);
        return;
      }
  
      setChange(newChange);
      setAmountGivenToCashier(givenAmount);
      setChangeCalculated(true);
    } else {
      alert('Amount given is less than the total amount due.');
      setChange(null);
      setChangeCalculated(false);
    }
  };  

  const restartDeposit = () => {
    updateCashInCheckout(5000);
    alert("Cash in checkout has been reset to $5000.");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card className="bg-light p-4 text-center" style={{ width: '100%', maxWidth: '800px' }}>
        <Container>
          <Button variant="secondary" type="button" onClick={authContext.logout}>
            Logout
          </Button>
          <h1>Welcome {authContext.username}!</h1>
          <p>Cash in Checkout: ${cashInCheckout.toFixed(2)}</p>
          <Button variant="secondary" onClick={restartDeposit}>
            Restart Deposit
          </Button>
          <hr/>
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
                  />
                </InputGroup>
                <Button
                  variant="primary"
                  onClick={searchArticle}
                  style={{ fontSize: '0.75rem', padding: '0.5rem 0.5rem' }}>
                    Search
                </Button>
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
              <hr></hr>
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
                      <Form.Check
                          type="radio"
                          label="Split"
                          name="paymentMethod"
                          id="split"
                          onChange={() => handlePaymentMethodSelection('SPLIT')}
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
                    {paidBy === 'SPLIT' && (
                  <div>
                      <Form.Group controlId="formCashAmount">
                          <Form.Label>Cash Amount</Form.Label>
                          <InputGroup className="mb-3">
                              <FormControl
                                  type="number"
                                  placeholder="Enter cash amount"
                                  value={cashAmount}
                                  onChange={(e) => setCashAmount(e.target.value)}
                              />
                          </InputGroup>
                      </Form.Group>
                      <Form.Group controlId="formCardAmount">
                          <Form.Label>Card Amount</Form.Label>
                          <InputGroup className="mb-3">
                              <FormControl
                                  type="number"
                                  placeholder="Enter card amount"
                                  value={cardAmount}
                                  onChange={(e) => setCardAmount(e.target.value)}
                              />
                          </InputGroup>
                      </Form.Group>
                      <p>Total Payment: ${(parseFloat(cashAmount) + parseFloat(cardAmount)).toFixed(2)}</p>
                      <Form.Group controlId="formAmountGivenToCashierSplit">
                          <Form.Label>Amount Given to Cashier</Form.Label>
                          <InputGroup className="mb-3">
                              <FormControl
                                  type="number"
                                  placeholder="Enter amount given to cashier"
                                  value={amountGivenToCashier}
                                  onChange={(e) => setAmountGivenToCashier(e.target.value)}
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
              <hr></hr>
              <Form.Group controlId="formRedeemCode">
                <Form.Label>Loyalty Card Code</Form.Label>
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="Enter redeem code"
                    value={loyaltyCode}
                    onChange={handleLoyaltyCodeChange}
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="formPointsToRedeem">
                <Form.Label>Points to Redeem</Form.Label>
                <InputGroup className="mb-3">
                  <FormControl
                    type="number"
                    placeholder="Enter points to redeem"
                    value={pointsToRedeem}
                    onChange={handlePointsToRedeemChange}
                  />
                  <br></br> <br></br>
                  <Button variant="primary" onClick={handleRedeemPoints}>
                    Redeem Points
                  </Button>
                  <Button variant="primary" onClick={handleGetAvailablePoints}>
                    Search points
                  </Button>
                </InputGroup>
              </Form.Group>
              <hr></hr>
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
