import React from 'react';
import { Alert } from 'react-native';

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

// Razorpay configuration
const RAZORPAY_KEY_ID = 'rzp_test_NyLZPzYHIYtxqW';
const RAZORPAY_KEY_SECRET = 'OixhI108NMwzhJIAkNrHx5jx';

interface OrderDetails {
  dishName: string;
  price: number;
  cuisine: string;
  cookingTime: string;
}

export const initiatePayment = async (orderDetails: OrderDetails): Promise<{success: boolean, orderId?: string, paymentId?: string}> => {
  return new Promise((resolve) => {
    const { dishName, price } = orderDetails;
    
    // Mock Razorpay integration for React Native
    // In a real app, you would use react-native-razorpay package
    
    const options: RazorpayOptions = {
      key: RAZORPAY_KEY_ID,
      amount: price * 100, // Amount in paise
      currency: 'INR',
      name: 'Mood Food',
      description: `Order for ${dishName}`,
      prefill: {
        name: 'User Name',
        email: 'user@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#000000'
      }
    };

    // Enhanced payment flow with better UX
    Alert.alert(
      '🍽️ Mood Food - Payment Gateway',
      `Order Details:\n• ${dishName}\n• Amount: ₹${price}\n• Payment Method: Razorpay\n\nKey ID: ${RAZORPAY_KEY_ID}\n\nChoose payment outcome:`,
      [
        {
          text: 'Cancel Payment',
          style: 'cancel',
          onPress: () => resolve({ success: false })
        },
        {
          text: 'Simulate Payment Success ✅',
          onPress: () => {
            // Show processing alert first
            Alert.alert(
              'Processing Payment...',
              'Please wait while we process your payment',
              [],
              { cancelable: false }
            );
            
            // Simulate payment processing delay
            setTimeout(() => {
              const mockPaymentId = `pay_${Date.now()}`;
              const mockOrderId = `order_${Date.now()}`;
              
              Alert.alert(
                'Payment Successful! 🎉',
                `Payment ID: ${mockPaymentId}\nOrder ID: ${mockOrderId}\n\nYour order has been placed successfully!`,
                [{ text: 'OK', onPress: () => resolve({ 
                  success: true, 
                  orderId: mockOrderId,
                  paymentId: mockPaymentId 
                })}]
              );
            }, 2000);
          }
        },
        {
          text: 'Simulate Payment Failed ❌',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Payment Failed',
              'Transaction could not be completed. Please try again or use a different payment method.',
              [{ text: 'OK', onPress: () => resolve({ success: false }) }]
            );
          }
        }
      ]
    );
  });
};

export const createOrder = async (amount: number, currency: string = 'INR') => {
  // Mock order creation
  // In production, this would call your backend API to create a Razorpay order
  
  try {
    const order = {
      id: `order_${Date.now()}`,
      entity: 'order',
      amount: amount * 100,
      amount_paid: 0,
      amount_due: amount * 100,
      currency,
      receipt: `receipt_${Date.now()}`,
      status: 'created',
      created_at: Math.floor(Date.now() / 1000)
    };
    
    return order;
  } catch (error) {
    throw new Error('Failed to create order');
  }
};

export const verifyPayment = async (
  paymentId: string,
  orderId: string,
  signature: string
) => {
  // Mock payment verification
  // In production, this would verify the payment signature on your backend
  
  try {
    // Mock verification logic
    const isValid = paymentId && orderId && signature;
    
    if (isValid) {
      return {
        success: true,
        message: 'Payment verified successfully'
      };
    } else {
      throw new Error('Invalid payment signature');
    }
  } catch (error) {
    return {
      success: false,
      message: 'Payment verification failed'
    };
  }
};

// Order tracking functionality
export const trackOrder = (orderId: string) => {
  const orderStatuses = [
    'Order Placed',
    'Restaurant Confirmed',
    'Preparing Food',
    'Out for Delivery',
    'Delivered'
  ];
  
  // Mock order tracking
  const currentStatusIndex = Math.floor(Math.random() * orderStatuses.length);
  const currentStatus = orderStatuses[currentStatusIndex];
  const estimatedTime = Math.floor(Math.random() * 45) + 15; // 15-60 minutes
  
  const trackingInfo = {
    orderId,
    status: currentStatus,
    estimatedDeliveryTime: `${estimatedTime} minutes`,
    trackingSteps: orderStatuses.map((status, index) => ({
      step: status,
      completed: currentStatusIndex >= index,
      timestamp: index <= currentStatusIndex ? 
        new Date(Date.now() - (orderStatuses.length - index) * 5 * 60 * 1000) : null
    }))
  };

  // Show tracking information in an alert
  const completedSteps = trackingInfo.trackingSteps
    .filter(step => step.completed)
    .map(step => `✅ ${step.step}`)
    .join('\n');
  
  const pendingSteps = trackingInfo.trackingSteps
    .filter(step => !step.completed)
    .map(step => `⏳ ${step.step}`)
    .join('\n');

  Alert.alert(
    `Order Tracking - ${orderId}`,
    `Current Status: ${currentStatus}\nEstimated Delivery: ${estimatedTime} minutes\n\nProgress:\n${completedSteps}${pendingSteps ? '\n\n' + pendingSteps : ''}`,
    [{ text: 'OK' }]
  );
  
  return trackingInfo;
};