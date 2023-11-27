import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity({name: 'transaction'})
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column({type: 'bigint'})
    card_number: number

    @Column()
    cvv: number

    @Column()
    expiration_month: string
    
    @Column()
    expiration_year: string

    @Column()
    email: string

    @Column()
    pk: string
    
    @Column()
    token: string

    @Column()
    jwt: string

    @Column({type: 'timestamp', default: () => 'now()'})
    createdAt: Date

}