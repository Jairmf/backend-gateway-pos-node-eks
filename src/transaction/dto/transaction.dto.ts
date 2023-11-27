import { IsString, MinLength, MaxLength, IsNumber, Length, IsIn, Min, Max, Matches, IsEmail, IsInt, IsNotEmpty} from "class-validator";
import { Transform } from "class-transformer";
export class GenerateTokenDto {
    @IsNumber()
    @Min(999999999999)
    @Max(9999999999999999)
    card_number:number;
    
    @IsNumber()
    @Min(99)
    @Max(9999)
    cvv:number;

    @Transform(({ value }) => {
        return Number(value);
    })
    @IsInt()
    @Min(1)
    @Max(12)
    expiration_month:string;

    @Transform(({ value }) => {
        return Number(value);
    })
    @Max(new Date().getFullYear() + 5)
    @Min(new Date().getFullYear())
    expiration_year:string;

    @IsEmail()
    @IsString()
    @MinLength(5)
    @MaxLength(100)
    @Matches(/^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com|yahoo\.es)$/, {
        message: 'El correo electrónico debe ser de gmail.com, hotmail.com o yahoo.es',
    })
    email:string;
}

export class GetCardDataDto {
    @Length(16)
    token: string;
}