import catchAsync from '../../utils/catchAsync';
import { PaymentServices } from './payment.service';

const paymentConfirmation = catchAsync(async (req, res) => {
  const { transactionId } = req.query;
  const result = await PaymentServices.paymentConfirmationIntoDB(
    transactionId as string,
  );

  // send response
  res.send(result);
});

export const PaymentControllers = {
  paymentConfirmation,
};
