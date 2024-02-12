import { Strategy } from 'passport-42';
import { Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

    private logger = new Logger(LocalStrategy.name);

    constructor () { 
        super({
            clientID: process.env.INTRA_CLIENT_ID,
            clientSecret: process.env.INTRA_CLIENT_SECRET,
            callbackURL: process.env.INTRA_REDIRECT_URI,
        });
    }

    async validate (accessToken: string, refreshToken: string, profile: any) {

        this.logger.debug({
            accessToken,
            refreshToken,
            profile
        })

        return profile;
    }
}