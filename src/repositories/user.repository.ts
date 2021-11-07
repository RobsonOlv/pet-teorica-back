import UserSchema from '../models/user';

export class UserRepository {
    async findOneUser(ra: any, ano: any) {
        return (
            await UserSchema.findOne({ ra: ra, ano: ano })
        );
    }

    async updateOneUser(ra: any, ano: any, resultado: any) {
        return (
            await UserSchema.updateOne({ ra: ra, ano: ano }, [{ $set: { resultado: resultado } }])
        );
    }
}