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
);

//fetch contact info
faqsRouter.get(
  "/contacts",
  FaqsMiddleware.fetch_contact_info,
  FaqsController.fetch_contact_info
);

//create/update contact info
faqsRouter.post(
  "/contacts",
  FaqsMiddleware.validate_create_contact_info_form,
  AuthMiddleWare.admin.validate_token_authorization,
  FaqsMiddleware.fetch_contact_info,
  FaqsMiddleware.create_contact_info,
  FaqsController.create_update_contact_info
);

//send bulk mail to users
faqsRouter.post(
  "/sendmail",
  FaqsMiddleware.validate_send_bulk_mail_form,
  AuthMiddleWare.admin.validate_token_authorization,
  FaqsMiddleware.verify_choice_of_mail,
  FaqsController.send_bulk_mail
);

//update existing faqs
faqsRouter.put(
  "/:faq_id",
  FaqsMiddleware.validate_create_faqs_form,
  AuthMiddleWare.admin.validate_token_authorization,
  FaqsMiddleware.validate_faq_id_params,
  FaqsMiddleware.update_faq,
  FaqsController.update_existing_faq
);

//delete existing faqs
faqsRouter.delete(
  "/:faq_id",
  AuthMiddleWare.admin.validate_token_authorization,
  FaqsMiddleware.validate_faq_id_params,
  FaqsController.delete_existing_faq
);
