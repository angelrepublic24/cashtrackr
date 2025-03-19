import * as bcrypt from 'bcrypt';


export const checkPassword = async (password: string, hash: string) => {
    await bcrypt.compare(password, hash);
    return
}