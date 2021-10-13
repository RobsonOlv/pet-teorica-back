import UserSchema from '../models/user';

export class UserRepository {
    async findOneUser(ra: any) {
        return (
            await UserSchema.findOne({ ra: ra })
        );
    }

    async updateOneUser(ra: any, resultado: any) {
        return (
            await UserSchema.updateOne({ ra: ra }, [{ $set: { resultado: resultado } }])
        );
    }
}