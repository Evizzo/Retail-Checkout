import { useState, ChangeEvent, FormEvent } from 'react';
import { Container, Card, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import ArticleTable, { Article } from './ArticleTable';
import { executeSaveBill } from '../api/ApiService';

function RetailCheckoutPage() {
  const [serialNumber, setSerialNumber] = useState('');
  const [articleName, setArticleName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [showPaymentSection, setShowPaymentSection] = useState(false);
  const [paidBy, setPaidBy] = useState<'CASH' | 'CARD' | null>(null);

  const handleSerialNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSerialNumber(e.target.value);
  };

  const handleArticleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setArticleName(e.target.value);
  };

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(e.target.value));
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
  };

  const handleAddArticle = () => {
    if (serialNumber.trim() !== '' && articleName.trim() !== '' && price.trim() !== '') {
      const newArticle: Article = { serialNumber, articleName: articleName, quantity, price: Number(price) };
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
      setQuantity(1);
      setPrice('');
    }
  };

  const handleEditArticle = (index: number) => {
    const article = articles[index];
    setSerialNumber(article.serialNumber);
    setArticleName(article.articleName);
    setQuantity(article.quantity);
    setPrice(article.price.toString());
    setEditIndex(index);
  };

  const handleDeleteArticle = (index: number) => {
    const updatedArticles = [...articles];
    updatedArticles.splice(index, 1);
    setArticles(updatedArticles);
    setEditIndex(null);
  };

  const handleProceedToPayment = () => {
    setShowPaymentSection(true);
  };

  const handlePaymentMethodSelection = (method: 'CASH' | 'CARD') => {
    setPaidBy(method);
  };

  const handleGoBack = () => {
    setShowPaymentSection(false);
  };

  const handlePaymentSubmission = async () => {
    if (!paidBy) {
      alert("Please select a payment method.");
      return;
    }

    try {
      const bill = {
        articles,
        paidBy
      };
      const response = await executeSaveBill(bill);
      console.log("Bill saved successfully:", response.data);

      setArticles([]);
      setSerialNumber('');
      setArticleName('');
      setQuantity(1);
      setPrice('');
      setPaidBy(null);
      setShowPaymentSection(false);
    } catch (error) {
      console.error("Error saving bill:", error);
    }
  };

  const handleSubmitReceipt = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!paidBy) {
      alert("Please select a payment method.");
      return;
    }
    try {
      const bill = { articles, paidBy };
      const response = await executeSaveBill(bill);
      console.log("Bill saved successfully:", response.data);
      setArticles([]);
      setSerialNumber('');
      setArticleName('');
      setQuantity(1);
      setPrice('');
      setPaidBy(null);
      setShowPaymentSection(false);
    } catch (error) {
      console.error("Error saving bill:", error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card className="bg-light p-4 text-center" style={{ width: '100%', maxWidth: '800px' }}>
        <Container>
          <h1>Welcome!</h1>
          <br />
          {!showPaymentSection ? (
            <Form onSubmit={handleSubmitReceipt}>
              <Form.Group controlId="formSerialNumber">
                <Form.Label>Serial Number</Form.Label>
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="Enter serial number"
                    value={serialNumber}
                    onChange={handleSerialNumberChange}
                    required
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="formArticleName">
                <Form.Label>Article Name</Form.Label>
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="Enter article name"
                    value={articleName}
                    onChange={handleArticleNameChange}
                    required
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
                    min={1}
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="formPrice">
                <Form.Label>Price</Form.Label>
                <InputGroup className="mb-3">
                  <FormControl
                    type="number"
                    placeholder="Enter price"
                    value={price}
                    onChange={handlePriceChange}
                    required
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
