import e from "express";
import { DefaultHelper } from "../../utils/helpers.js";
import { FaqsMiddleware } from "../../middlewares/faqs.js";
import { FaqsController } from "../../controllers/faqs.js";
import { AuthMiddleWare } from "../../middlewares/auth.js";

export const faqsRouter = e.Router();

//fetch multiple faqs
faqsRouter.get(
  "/",
  AuthMiddleWare.integrate_pagination_query,
  FaqsMiddleware.fetch_multiple_faqs,
  FaqsController.fetch_faqs
);

//add new faqs
faqsRouter.post(
  "/",
  FaqsMiddleware.validate_create_faqs_form,
  AuthMiddleWare.admin.validate_token_authorization,
  FaqsMiddleware.create_faq,
  FaqsController.create_new_faq
); //review this later for authentication
