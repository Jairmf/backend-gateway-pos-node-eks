import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GenerateTokenDto } from './dto/transaction.dto';
import { Transaction } from './transaction.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const luhn = require('luhn');
require('dotenv').config()

@Injectable()
export class TransactionService {

    constructor(
        @InjectRepository(Transaction) private transactionRepository: Repository<Transaction>,
    ) { }

    generateToken(length: number): string {
        const buffer = crypto.randomBytes(length);
        const token = buffer.toString('base64')
            .replace(/[^a-zA-Z0-9]/g, '')
            .substr(0, length);
        return token;
    }

    validateLuhn(cardNumber: number): boolean {
        return luhn.validate(cardNumber);
    }
    
    async createTransaction(transaction: GenerateTokenDto, pk: string) {
        if(!pk){
            return new HttpException('Debe proporcionar un pk', HttpStatus.UNAUTHORIZED);
        }
        const payload = {
            transaction
        };
        const secret = process.env.TOKEN_SECRET || 'test';
        // Generar el token con un límite de tiempo de 15 minutos
        const token = jwt.sign(payload, secret, { expiresIn: '15m' });
        if (!this.validateLuhn(transaction.card_number)) {
            return new HttpException('Número de tarjeta inválido', HttpStatus.BAD_REQUEST);
        }
        const newTransaction = this.transactionRepository.create({
            ...transaction,
            pk,
            token: this.generateToken(16),
            jwt: token,
        });

        return this.transactionRepository.save(newTransaction);
    }

    async validateJwt(jwtString: string) {
        const secret = process.env.TOKEN_SECRET || 'test';
        try {
            const payload = jwt.verify(jwtString, secret);
            return payload;
        } catch (error) {
            throw new HttpException('Superó el tiempo de máximo para realizar la transacción', HttpStatus.UNAUTHORIZED);
        }
    }

    async getTransactionByToken(token: string) {
        const transaction = await this.transactionRepository.findOneBy({ token });
        if (!transaction) {
            throw new HttpException('No se encuentra la transacción asociada al token proporcionado', HttpStatus.NOT_FOUND);
        }
        await this.validateJwt(transaction.jwt);
        const transactionResponse = {
            card_number: transaction.card_number,
            expiration_month: transaction.expiration_month,
            expiration_year: transaction.expiration_year,
            email: transaction.email
        }
        return transactionResponse;
    }
}
