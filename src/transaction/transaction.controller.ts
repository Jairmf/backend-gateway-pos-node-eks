import { Body, Controller, Headers, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { GenerateTokenDto, GetCardDataDto } from './dto/transaction.dto';

@Controller()
export class TransactionController {

    constructor(private transactionService:TransactionService) { }

    @Post('token')
    creatToken(@Body() newTransaction: GenerateTokenDto, 
    // Get Bearer header from request
    @Headers('Bearer') pk: string
    ){
        return this.transactionService.createTransaction(newTransaction, pk);
    }

    @Post('cardData')
    getCardData(@Body() cardData: GetCardDataDto){
        const {token} = cardData;
        return this.transactionService.getTransactionByToken(token);
    }

}
