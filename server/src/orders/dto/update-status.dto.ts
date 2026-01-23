import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';
import { OrderStatus, PaymentStatus } from '@umkm/shared/types';

export class UpdateOrderStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(OrderStatus))
  status: OrderStatus;
}

export class UpdatePaymentStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(PaymentStatus))
  paymentStatus: PaymentStatus;

  @IsOptional()
  paidAmount?: number;
}
