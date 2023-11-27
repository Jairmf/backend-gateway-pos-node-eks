import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Transaction]),
    ],
    controllers: [TransactionController],
    providers: [TransactionService],
    exports: [TransactionService] // Exportar servicios consumidos por otro módulo
})
export class TransactionModule {}
