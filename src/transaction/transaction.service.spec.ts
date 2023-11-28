import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GenerateTokenDto } from './dto/transaction.dto';

describe('TransactionService', () => {
  let transactionService: TransactionService;
  let transactionRepository: Repository<Transaction>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useClass: Repository,
        },
      ],
    }).compile();

    transactionService = moduleRef.get<TransactionService>(TransactionService);
    transactionRepository = moduleRef.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
  });

  describe('generateToken', () => {
    it('should generate a token with the specified length', () => {
      const tokenLength = 16;
      const token = transactionService.generateToken(tokenLength);
      expect(token).toHaveLength(tokenLength);
      expect(token).toMatch(/^[a-zA-Z0-9]+$/);
    });
  });

  describe('createTransaction', () => {
    it('should create a transaction', async () => {
      const transaction: GenerateTokenDto = {
        card_number: 1234567890123456,
        cvv: 123,
        expiration_month: '12',
        expiration_year: '2023',
        email: 'test@gmail.com',
      };

      const pk = 'yourPrivateKey';

      const result = await transactionService.createTransaction(transaction, pk);

      expect(result).toBeDefined();
    });
  });

});
