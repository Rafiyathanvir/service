import { collections } from '../../db/collections.js';
import {db} from '../../db/database.js'



export async function deactivateAccount(userId) {
    const _db = await db();
    const user = await _db.collection(collections.register).findOne({ email: email });
    if (user) {
        await _db.collection(collections.register).updateOne(
            { email: email },
            { $set: { active: false } }
        );
        return true; 
    }
    return false; 
}
