import e from "express";
import { WebhookController } from "../controllers/webhook.js";

export const webhookRouter = e.Router();

//webhook to recieve deposits from paystack
webhookRouter.post("/paystack/", WebhookController.handle_from_paystack);
