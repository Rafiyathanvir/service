import express from "express";
import { deactivateAccount } from "../../service/accountsetting-service/accountsetting-service.js";
const accountsettingRoutes = express.Router();

accountsettingRoutes.post('/deactivate', async (req, res) => {
    try {
        const { email } = req.body;
        const deactivated = await deactivateAccount(email);
        if (deactivated) {
            res.status(200).send("Account deactivated successfully");
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        console.error("Error deactivating account:", error);
        res.status(500).send("Internal server error");
    }
});

export default accountsettingRoutes;
