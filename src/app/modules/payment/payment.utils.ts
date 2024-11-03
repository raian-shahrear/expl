import axios from 'axios';
import config from '../../config';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

type TPaymentInfo = {
  transactionId: string;
  price: number;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  customerPhone: string;
};

export const initialPayment = async (paymentInfo: TPaymentInfo) => {
  try {
    const response = await axios.post(config.payment_url as string, {
      store_id: config.store_id,
      signature_key: config.signature_key,
      tran_id: paymentInfo?.transactionId,
      success_url: `${config.server_url}/api/v1/payment/confirmation?transactionId=${paymentInfo?.transactionId}`,
      fail_url: `${config.server_url}/api/v1/payment/confirmation`,
      cancel_url: `${config.frontend_url}`,
      amount: paymentInfo?.price,
      currency: 'BDT',
      desc: 'Merchant Registration Payment',
      cus_name: paymentInfo?.customerName,
      cus_email: paymentInfo?.customerEmail,
      cus_add1: paymentInfo?.customerAddress,
      cus_add2: 'N/A',
      cus_city: 'N/A',
      cus_state: 'N/A',
      cus_postcode: 'N/A',
      cus_country: 'N/A',
      cus_phone: paymentInfo?.customerPhone,
      type: 'json',
    });

    return response?.data;
  } catch (err) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `${err && 'Payment initiation failed'}`,
    );
  }
};

// verify payment
export const verifyPayment = async (txId: string) => {
  try {
    const response = await axios.get(config.payment_verify_url as string, {
      params: {
        store_id: config.store_id,
        signature_key: config.signature_key,
        request_id: txId,
        type: 'json',
      },
    });

    return response?.data;
  } catch (err) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `${err && 'Payment validation failed'}`,
    );
  }
};
