import bcrypt from 'bcrypt';

const saltRounds = 10;

export const userPasswordHash = async (userPassword:string): Promise<string> => {
    return await bcrypt.hash(userPassword,saltRounds);
};

export const usePasswordCompare = async (userPassword:string  , hashedPassword:string):Promise<boolean> =>{
    return await bcrypt.compare(userPassword, hashedPassword);
};



