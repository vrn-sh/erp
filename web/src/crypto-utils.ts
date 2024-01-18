import config from './config';

export function createCookie(id: string, token: string, role: string) {
    const cookie = `${id}/${token}/${role}`;
    return btoa(cookie);
}

// function encryptString(inputString : string, secretKey : string) {
//   const cipher = crypto.createCipher('aes-256-cbc', secretKey);
//   let encrypted = cipher.update(inputString, 'utf8', 'hex');
//   encrypted += cipher.final('hex');
//   return encrypted;
// };

// function decryptString(encryptedString : string, secretKey : string) {
//     const decipher = crypto.createDecipher('aes-256-cbc', secretKey);
//     let decrypted = decipher.update(encryptedString, 'hex', 'utf8');
//     decrypted += decipher.final('utf8');
//     return decrypted;
// };

export function getCookiePart(cookie: string, type: string) {
    const res = atob(cookie);
    const parties = res.split('/');
    if (parties.length >= 3) {
        switch (type) {
            case 'id':
                return parseInt(parties[0], 10);
            case 'token':
                return parties[1];
            case 'role':
                return parseInt(parties[2], 10);
            default:
                return null; // Type non valide
        }
    }
    return null; // Si la chaîne n'a pas le bon format
}
