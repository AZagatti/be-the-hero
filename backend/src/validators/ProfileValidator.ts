import { celebrate, Segments, Joi } from "celebrate";

export default {
  index: celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required()
    }).unknown()
  })
};
