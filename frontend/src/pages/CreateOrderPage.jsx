
import { useState } from 'react';
import { useNavigate } from 'react-router';
import OrderService from '../services/orderService';
import Form from '../components/Form';

function CreateOrderPage() {
    return (
        <div className='create-order'>
            <Form />
        </div>
    );
}
export default CreateOrderPage;