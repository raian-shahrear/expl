import { join } from 'path';
import { UserModel } from '../users/users.model';
import { verifyPayment } from './payment.utils';
import { readFileSync } from 'fs';
import config from '../../config';

const paymentConfirmationIntoDB = async (transactionId: string) => {
  const verifyResponse = await verifyPayment(transactionId);
  let messageTitle;
  let message;
  if (verifyResponse && verifyResponse.pay_status === 'Successful') {
    const updatedUser = await UserModel.findOneAndUpdate(
      { 'paymentStatus.transactionId': transactionId },
      {
        'paymentStatus.isPaid': true,
        'paymentStatus.paidAt': new Date(),
        isVerified: 'verified',
      },
      { new: true },
    );
    if (!updatedUser) {
      throw new Error('User not found or update failed!');
    }
    messageTitle = 'Congratulation!';
    message = 'Payment Successful.';
  } else {
    messageTitle = 'Oops!';
    message = 'Payment Failed.';
  }

  const filePath = join(__dirname, '../../../views/confirmation.html');
  let template = readFileSync(filePath, 'utf-8');
  template = template.replace('{{message-title}}', messageTitle);
  template = template.replace('{{message}}', message);
  template = template.replace('{{home-url}}', config.frontend_url as string);

  return template;
};

export const PaymentServices = {
  paymentConfirmationIntoDB,
};
